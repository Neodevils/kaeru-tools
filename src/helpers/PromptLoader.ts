import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PromptData {
	description: string;
	template: string;
}

interface PromptsFile {
	[key: string]: PromptData;
}

class PromptLoader {
	private static prompts: PromptsFile | null = null;

	static load(): PromptsFile {
		if (!this.prompts) {
			const file = path.resolve(__dirname, "../prompts/prompts.json");
			this.prompts = JSON.parse(
				fs.readFileSync(file, "utf-8"),
			) as PromptsFile;
		}
		return this.prompts;
	}

	static get(key: string): PromptData | null {
		const prompts = this.load();
		return prompts[key] ?? null;
	}
}

export default PromptLoader;
