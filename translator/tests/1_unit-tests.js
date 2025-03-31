const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();

suite("Unit Tests", () => {
    suite("American to British English Translation", () => {
        test("Translate Mangoes are my favorite fruit. to British English", () => {
            const { translation } = translator.translate(
                "Mangoes are my favorite fruit.",
                "american-to-british"
            );

            assert.strictEqual(translation, "Mangoes are my favourite fruit.");
        });

        test("Translate I ate yogurt for breakfast. to British English", () => {
            const { translation } = translator.translate(
                "I ate yogurt for breakfast.",
                "american-to-british"
            );
            assert.strictEqual(translation, "I ate yoghurt for breakfast.");
        });

        test("Translate We had a party at my friend's condo. to British English", () => {
            const { translation } = translator.translate(
                "We had a party at my friend's condo.",
                "american-to-british"
            );
            assert.strictEqual(translation, "We had a party at my friend's flat.");
        });

        test("Translate Can you toss this in the trashcan for me? to British English", () => {
            const { translation } = translator.translate(
                "Can you toss this in the trashcan for me?",
                "american-to-british"
            );
            assert.strictEqual(translation, "Can you toss this in the bin for me?");
        });

        test("Translate The parking lot was full. to British English", () => {
            const { translation } = translator.translate(
                "The parking lot was full.",
                "american-to-british"
            );
            assert.strictEqual(translation, "The car park was full.");
        });

        test("Translate Like a high tech Rube Goldberg machine. to British English", () => {
            const { translation } = translator.translate(
                "Like a high tech Rube Goldberg machine.",
                "american-to-british"
            );
            assert.strictEqual(
                translation,
                "Like a high tech Heath Robinson device."
            );
        });

        test("Translate To play hooky means to skip class or work. to British English", () => {
            const { translation } = translator.translate(
                "To play hooky means to skip class or work.",
                "american-to-british"
            );
            assert.strictEqual(translation, "To bunk off means to skip class or work.");
        });

        test("Translate No Mr. Bond, I expect you to die. to British English", () => {
            const { translation } = translator.translate(
                "No Mr. Bond, I expect you to die.",
                "american-to-british"
            );
            assert.strictEqual(translation, "No Mr Bond, I expect you to die.");
        });

        test("Translate Dr. Grosh will see you now. to British English", () => {
            const { translation } = translator.translate(
                "Dr. Grosh will see you now.",
                "american-to-british"
            );
            assert.strictEqual(translation, "Dr Grosh will see you now.");
        });

        test("Translate Lunch is at 12:15 today. to British English", () => {
            const { translation } = translator.translate(
                "Lunch is at 12:15 today.",
                "american-to-british"
            );
            assert.strictEqual(translation, "Lunch is at 12.15 today.");
        });
    });
});
