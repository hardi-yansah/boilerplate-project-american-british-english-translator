const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
    this.britishToAmericanSpelling = this.invertMap(americanToBritishSpelling);
    this.britishToAmericanTitles = this.invertMap(americanToBritishTitles);
  }

  invertMap(map) {
    const inverted = {};
    for (const key in map) {
      inverted[map[key]] = key;
    }
    return inverted;
  }

  translate(text, locale) {
    let translated = text;

    // Process titles
    const titlesMap =
      locale === "american-to-british"
        ? americanToBritishTitles
        : this.britishToAmericanTitles;

    const sortedTitles = Object.entries(titlesMap).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [key, value] of sortedTitles) {
      const regex = new RegExp(`\\b${key}(?=\\s|$)`, "gi");
      translated = translated.replace(
        regex,
        `<span class="highlight">${value}</span>`
      );
    }

    // Process time formats
    const timeRegex =
      locale === "american-to-british"
        ? /(\d{1,2}):(\d{2})/g
        : /(\d{1,2})\.(\d{2})/g;
    translated = translated.replace(timeRegex, (match) => {
      const replacement = match.replace(
        locale === "american-to-british" ? ":" : ".",
        locale === "american-to-british" ? "." : ":"
      );
      return `<span class="highlight">${replacement}</span>`;
    });

    // Process 'only' terms
    const onlyTerms =
      locale === "american-to-british" ? americanOnly : britishOnly;
    const sortedOnlyTerms = Object.entries(onlyTerms).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [key, value] of sortedOnlyTerms) {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      translated = translated.replace(
        regex,
        `<span class="highlight">${value}</span>`
      );
    }

    // Process spelling differences
    const spellingMap =
      locale === "american-to-british"
        ? americanToBritishSpelling
        : this.britishToAmericanSpelling;

    const sortedSpelling = Object.entries(spellingMap).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [key, value] of sortedSpelling) {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      translated = translated.replace(
        regex,
        `<span class="highlight">${value}</span>`
      );
    }

    return translated;
  }
}

module.exports = Translator;
