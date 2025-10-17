# kaeru-tools

Utility functions, enums, and helpers powering the Karu ecosystem — built for reliability, modularity, and developer ease.

## 📦 Installation

```sh
npm install kaeru-tools
```

or with yarn

```sh
yarn add kaeru-tools
```

## 🚀 Usage

Import what you need directly from the package — no subfolders required.

```ts
import KaruAssistant from "kaeru-tools";

const client = new KaruAssistant();
// Use client methods here
```

## 📚 Available Exports

-   **Enums**: Languages, SummaryLength, SummaryStyle, etc.
-   **Helpers**: Utility functions like resolveLanguageFromLocale
-   **Classes**: KaruAssistant — main client class for AI interactions and more.

## ⚙️ Configuration & Environment

Make sure to provide .env variables as needed — for example, API keys for Google Generative AI.
Example .env:

```env
GOOGLE_API_KEY=your_api_key_here
```

# 🧪 Testing

Run tests with:

```sh
npm run test
```

Make sure you have your environment variables and prompts configured correctly.
