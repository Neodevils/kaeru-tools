/**
 * SummaryLength enum defines possible lengths for generated summaries.
 * - SHORT: Very brief, 2-3 sentences.
 * - MEDIUM: Moderate length, 1-2 paragraphs.
 * - LONG: Extended summary, 3-4 paragraphs.
 */
export enum SummaryLength {
	SHORT = "short",
	MEDIUM = "medium",
	LONG = "long",
}

/**
 * SummaryStyle enum defines tone/style options for summaries.
 * Options vary from professional, academic to casual and simple.
 */
export enum SummaryStyle {
	PROFESSIONAL = "professional",
	CASUAL = "casual",
	ACADEMIC = "academic",
	TECHNICAL = "technical",
	SIMPLE = "simple",
}

/**
 * Languages enum uses ISO-style lowercase codes.
 * This format is safer for comparison and processing.
 */
export enum Languages {
	EN = "en",
	ES = "es",
	FR = "fr",
	DE = "de",
	IT = "it",
	PT = "pt",
	RU = "ru",
	ZH = "zh",
	JA = "ja",
	KO = "ko",
	AR = "ar",
	HI = "hi",
	TR = "tr",
}

/**
 * Maps locale strings (like 'en-us', 'tr-tr') to standardized Languages enum values.
 */
export const LOCALE_TO_LANGUAGE: Record<string, Languages> = {
	"en-us": Languages.EN,
	"en-gb": Languages.EN,
	en: Languages.EN,
	"es-es": Languages.ES,
	"es-mx": Languages.ES,
	es: Languages.ES,
	"fr-fr": Languages.FR,
	fr: Languages.FR,
	"de-de": Languages.DE,
	de: Languages.DE,
	"it-it": Languages.IT,
	it: Languages.IT,
	"pt-br": Languages.PT,
	pt: Languages.PT,
	"ru-ru": Languages.RU,
	ru: Languages.RU,
	"zh-cn": Languages.ZH,
	"zh-hans": Languages.ZH,
	zh: Languages.ZH,
	"ja-jp": Languages.JA,
	ja: Languages.JA,
	"ko-kr": Languages.KO,
	ko: Languages.KO,
	"ar-sa": Languages.AR,
	ar: Languages.AR,
	"hi-in": Languages.HI,
	hi: Languages.HI,
	"tr-tr": Languages.TR,
	tr: Languages.TR,
};

/**
 * Maps Languages enum values to human-readable display names.
 * Used in UI, Discord messages, or dropdowns.
 */
export const LANGUAGE_DISPLAY_NAME: Record<Languages, string> = {
	[Languages.EN]: "English",
	[Languages.ES]: "Spanish",
	[Languages.FR]: "French",
	[Languages.DE]: "German",
	[Languages.IT]: "Italian",
	[Languages.PT]: "Portuguese",
	[Languages.RU]: "Russian",
	[Languages.ZH]: "Chinese",
	[Languages.JA]: "Japanese",
	[Languages.KO]: "Korean",
	[Languages.AR]: "Arabic",
	[Languages.HI]: "Hindi",
	[Languages.TR]: "Turkish",
};
