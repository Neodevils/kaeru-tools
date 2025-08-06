import { Languages, LOCALE_TO_LANGUAGE } from "../enums/languages.js";

function resolveLanguageFromLocale(locale: string): Languages | undefined {
	if (!locale) return undefined;
	const lowerLocale = locale.toLowerCase();
	const intl = new Intl.Locale(locale);
	const rawLang = intl.language.toLowerCase();

	return LOCALE_TO_LANGUAGE[lowerLocale] || LOCALE_TO_LANGUAGE[rawLang];
}

export { resolveLanguageFromLocale };
