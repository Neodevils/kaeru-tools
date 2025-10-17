import dotenv from "dotenv";
import {
	GoogleGenerativeAI,
	GenerativeModel,
	GenerationConfig,
} from "@google/generative-ai";
import { SummaryLength, SummaryStyle, Languages } from "../enums/languages.js";
import PromptLoader from "../helpers/PromptLoader.js";

dotenv.config();

/**
 * Options for initializing KaruAssistant.
 * @typedef {Object} KaruOptions
 * @property {string} [modelName] - Name of the generative AI model to use.
 * @property {GenerationConfig} [generationConfig] - Configuration for generation parameters.
 */
interface KaruOptions {
	apiKey?: string;
	modelName?: string;
	generationConfig?: GenerationConfig;
}

/**
 * Options for summarization.
 * @typedef {Object} SummaryOptions
 * @property {SummaryLength} [length] - Desired summary length.
 * @property {SummaryStyle} [style] - Style of the summary.
 */
interface SummaryOptions {
	length?: SummaryLength;
	style?: SummaryStyle;
}

/**
 * Result structure returned by the translate method.
 * @property {string} cleaned - The cleaned input text after translation processing.
 * @property {string} translated - The translated text.
 */
interface TranslateResult {
	cleaned: string;
	translated: string;
}

/**
 * KaruAssistant is a wrapper for Google Generative AI models providing
 * methods for asking questions, summarizing text, extracting key points,
 * and translating text with configurable options.
 */
export default class KaruAssistant {
	/**
	 * @private
	 * @type {GenerativeModel}
	 */
	private model: GenerativeModel;

	/**
	 * Creates an instance of KaruAssistant.
	 * Requires `KARU_API_KEY` in environment variables.
	 *
	 * @param {KaruOptions} [options={}] - Options to configure the client.
	 * @throws Will throw an error if `KARU_API_KEY` is missing.
	 */
	constructor(options: KaruOptions = {}) {
		const apiKey =
			options.apiKey ??
			process.env.GOOGLE_AI_API_KEY ??
			globalThis.GOOGLE_AI_API_KEY;

		if (!apiKey) {
			throw new Error(
				"Missing API key. Provide via options.apiKey, process.env.GOOGLE_AI_API_KEY, or globalThis.GOOGLE_AI_API_KEY.",
			);
		}

		const {
			modelName = "gemma-3n-e4b-it",
			generationConfig = {
				temperature: 0.3,
				maxOutputTokens: 1024,
				topP: 0.9,
				topK: 10,
			},
		} = options;

		const genAI = new GoogleGenerativeAI(apiKey);

		this.model = genAI.getGenerativeModel({
			model: modelName,
			generationConfig,
		});
	}

	/**
	 * Sends a prompt to the generative model and returns the AI-generated response.
	 *
	 * @param {string} text - The input prompt text.
	 * @returns {Promise<string>} The generated response text.
	 */
	async ask(text: string): Promise<string> {
		const result = await this.model.generateContent(text);
		const response = result.response;
		return response.text();
	}

	/**
	 * Summarizes a given text in the specified language and style.
	 *
	 * @param {string} text - The text to summarize.
	 * @param {Languages} [language=Languages.EN] - The language of the summary.
	 * @param {SummaryOptions} [options={}] - Options to customize summary length and style.
	 * @returns {Promise<string>} The summarized text.
	 * @throws Will throw if the summarization prompt template is not found.
	 */
	async summarize(
		text: string,
		language: Languages = Languages.EN,
		options: SummaryOptions = {},
	): Promise<string> {
		const {
			length = SummaryLength.MEDIUM,
			style = SummaryStyle.PROFESSIONAL,
		} = options;

		const lengthMap: Record<SummaryLength, string> = {
			[SummaryLength.SHORT]: "2-3 sentences",
			[SummaryLength.MEDIUM]: "1-2 paragraphs",
			[SummaryLength.LONG]: "3-4 paragraphs",
		};

		const promptTemplate = PromptLoader.get("summarize")?.template;
		if (!promptTemplate)
			throw new Error("Summarize prompt template not found");

		const prompt = promptTemplate
			.replace("{language}", language)
			.replace("{length}", lengthMap[length])
			.replace("{style}", style)
			.replace("{text}", text);

		const result = await this.model.generateContent(prompt);
		return result.response.text();
	}

	/**
	 * Extracts key points from a given text.
	 *
	 * @param {string} text - The text to extract key points from.
	 * @param {Languages} [language=Languages.EN] - Language context for the extraction.
	 * @param {number} [maxPoints=5] - Maximum number of key points to extract.
	 * @returns {Promise<string>} A string listing the key points.
	 * @throws Will throw if the key points prompt template is not found.
	 */
	async getKeyPoints(
		text: string,
		language: Languages = Languages.EN,
		maxPoints: number = 5,
	): Promise<string> {
		const promptTemplate = PromptLoader.get("keypoints")?.template;
		if (!promptTemplate)
			throw new Error("Key points prompt template not found");

		const prompt = promptTemplate
			.replace("{count}", maxPoints.toString())
			.replace("{language}", language)
			.replace("{text}", text);

		const result = await this.model.generateContent(prompt);
		return result.response.text();
	}

	/**
	 * Translates text into a target language, optionally considering locale.
	 * Removes custom emoji markup from input before processing.
	 * @param {string} text - The text to translate.
	 * @param {string | Languages} targetLanguage - Target language or language code.
	 * @param {string} [fromLanguage] - Optional locale string to help determine target language.
	 * @returns {Promise<TranslateResult>} The cleaned original and translated text.
	 * @throws Will throw if the translate prompt template is missing or AI response is malformed.
	 */
	async translate(
		text: string,
		targetLanguage: string | Languages,
		fromLanguage?: string | Languages,
	): Promise<TranslateResult> {
		const inputText = text.replace(/<a?:.+?:\d{18}>/g, "").trim();

		const finalTargetLang =
			typeof targetLanguage === "string"
				? targetLanguage
				: targetLanguage;

		const promptTemplate = PromptLoader.get("translate")?.template;
		if (!promptTemplate)
			throw new Error("Translate prompt template not found");

		const fromLangStr = fromLanguage
			? typeof fromLanguage === "string"
				? fromLanguage
				: fromLanguage
			: "";

		let prompt = promptTemplate
			.replace(/\{targetLanguage\}/g, finalTargetLang)
			.replace("{text}", inputText);

		prompt = prompt.replace(/\{fromLanguage\}/g, fromLangStr);

		const result = await this.model.generateContent(prompt);
		const raw = result.response.text().trim();

		const cleanedMatch = raw.match(/Cleaned:\s*(.+)/i);
		const translatedMatch = raw.match(/Translated:\s*(.+)/i);

		const cleaned = cleanedMatch?.[1]?.trim();
		const translated = translatedMatch?.[1]?.trim();

		if (!cleaned || !translated) {
			throw new Error("Malformed response from AI");
		}

		return { cleaned, translated };
	}
}
