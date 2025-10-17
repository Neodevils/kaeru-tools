import { KaruAssistant, Languages } from "../index.js";

const client = new KaruAssistant();

const text = `asap help me pls`;

const translating = await client.translate(text, Languages.EN);

console.log(translating);
