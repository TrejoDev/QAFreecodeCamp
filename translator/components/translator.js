const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
    this.translationMaps = {
      "american-to-british": [
        { dictionary: americanOnly, caseSensitive: true },
        { dictionary: americanToBritishSpelling, caseSensitive: false },
        {
          dictionary: americanToBritishTitles,
          caseSensitive: false,
          title: true,
        },
      ],
      "british-to-american": [
        { dictionary: britishOnly, caseSensitive: true },
        {
          dictionary: this.reverseDictionary(americanToBritishSpelling),
          caseSensitive: false,
        },
        {
          dictionary: this.reverseDictionary(americanToBritishTitles),
          caseSensitive: false,
          title: true,
        },
      ],
    };

    this.timeRegex = {
      "american-to-british": /(\d{1,2}):(\d{2})/g,
      "british-to-american": /(\d{1,2})\.(\d{2})/g,
    };

    this.timeReplacement = {
      "american-to-british": "$1.$2",
      "british-to-american": "$1:$2",
    };
  }

  reverseDictionary(dictionary) {
    return Object.entries(dictionary).reduce(
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  applyTranslation(text, dictionary, caseSensitive = false, title = false) {
    return Object.keys(dictionary).reduce((acc, key) => {
      const value = dictionary[key];
      const regex = caseSensitive
        ? new RegExp(`\\b${this.escapeRegExp(key)}\\b`, "g")
        : new RegExp(this.escapeRegExp(key), "gi");
      return acc.replace(regex, (match) => {
        if (title && match[0] === match[0].toUpperCase()) {
          return value.charAt(0).toUpperCase() + value.slice(1);
        } else if (caseSensitive && match[0] === match[0].toUpperCase()) {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
      });
    }, text);
  }

  translate(text, locale) {
    if (!text || !locale) {
      return { error: "Required field(s) missing" };
    }

    if (!this.translationMaps[locale]) {
      return { error: "Invalid value for locale field" };
    }

    let translatedText = text;
    let translationOccurred = false;

    this.translationMaps[locale].forEach(
      ({ dictionary, caseSensitive, title }) => {
        const result = this.applyTranslation(
          translatedText,
          dictionary,
          caseSensitive,
          title
        );
        if (result !== translatedText) {
          translatedText = result;
          translationOccurred = true;
        }
      }
    );

    const timeRegex = this.timeRegex[locale];
    const timeReplace = this.timeReplacement[locale];
    if (timeRegex) {
      const newText = translatedText.replace(timeRegex, timeReplace);
      if (newText !== translatedText) {
        translatedText = newText;
        translationOccurred = true;
      }
    }

    return translationOccurred
      ? { text, translation: translatedText }
      : { text, translation: "Everything looks good to me!" };
  }

  highlight(originalText, translatedText) {
    if (originalText === translatedText) {
      return originalText;
    }

    const originalWords = originalText.split(/(\s+)/);
    const translatedWords = translatedText.split(/(\s+)/);

    const highlightedWords = translatedWords.map((translatedWord, index) => {
      const originalWord = originalWords[index] || "";
      const originalClean = originalWord
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "");
      const translatedClean = translatedWord
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "");

      if (originalClean !== translatedClean && translatedWord.trim() !== "") {
        return `<span class="highlight">${translatedWord}</span>`;
      }
      return translatedWord;
    });

    return highlightedWords.join("");
  }
}

module.exports = Translator;
