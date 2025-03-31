"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;

    if (!text || !locale) {
      return res.json({ error: "Required field(s) missing" });
    }

    const translationResult = translator.translate(text, locale);

    if (translationResult.error) {
      return res.json(translationResult);
    }

    if (
      translationResult.translation !== text &&
      translationResult.translation !== "Everything looks good to me!"
    ) {
      const highlightedTranslation = translator.highlight(
        text,
        translationResult.translation
      );
      return res.json({ text: text, translation: highlightedTranslation });
    }

    res.json(translationResult);
  });
};
