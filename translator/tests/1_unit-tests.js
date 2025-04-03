const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");
const translator = new Translator();
// const reversedTitles = translator.reverseDictionary(require("../components/american-to-british-titles.js"));
// console.log(reversedTitles);

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

    suite("British to American English Translation", () => {
        test("Translate We watched the footie match for a while. to American English", () => {
            const { translation } = translator.translate(
                "We watched the footie match for a while.",
                "british-to-american"
            );
            assert.strictEqual(translation, "We watched the soccer match for a while.");
        });

        test("Translate Paracetamol takes up to an hour to work. to American English", () => {
            const { translation } = translator.translate(
                "Paracetamol takes up to an hour to work.",
                "british-to-american"
            );
            assert.strictEqual(translation, "Tylenol takes up to an hour to work.");
        });

        test("Translate First, caramelise the onions. to American English", () => {
            const { translation } = translator.translate(
                "First, caramelise the onions.",
                "british-to-american"
            );
            assert.strictEqual(translation, "First, caramelize the onions.");
        });

        test("Translate I spent the bank holiday at the funfair. to American English", () => {
            const { translation } = translator.translate(
                "I spent the bank holiday at the funfair.",
                "british-to-american"
            );
            assert.strictEqual(translation, "I spent the public holiday at the amusement park.");
        });

        test("Translate I had a bicky then went to the chippy. to American English", () => {
            const { translation } = translator.translate(
                "I had a bicky then went to the chippy.",
                "british-to-american"
            );
            assert.strictEqual(translation, "I had a cookie then went to the fish-and-fish-and-chip shop.");
        });

        test("Translate I've just got bits and bobs in my bum bag. to American English", () => {
            const { translation } = translator.translate(
                "I've just got bits and bobs in my bum bag.",
                "british-to-american"
            );
            assert.strictEqual(translation, "I've just got odds and ends in my fanny pack.");
        });

        test("Translate The car boot sale at Boxted Airfield was called off. to American English", () => {
            const { translation } = translator.translate(
                "The car boot sale at Boxted Airfield was called off.",
                "british-to-american"
            );
            assert.strictEqual(translation, "The swap meet at Boxted Airfield was called off.");
        });

        test("Translate Have you met Mrs Kalyani? to American English", () => {
            const { translation } = translator.translate(
                "Have you met Mrs Kalyani?",
                "british-to-american"
            );
            console.log("Traducción obtenida:", translation);
            assert.strictEqual(translation, "Have you met Mrs. Kalyani?");
        });

        test("Translate Prof Joyner of King's College, London. to American English", () => {
            const { translation } = translator.translate(
                "Prof Joyner of King's College, London.",
                "british-to-american"
            );
            assert.strictEqual(translation, "Prof. Joyner of King's College, London.");
        });

        test("Translate Tea time is usually around 4 or 4.30. to American English", () => {
            const { translation } = translator.translate(
                "Tea time is usually around 4 or 4.30.",
                "british-to-american"
            );
            assert.strictEqual(translation, "Tea time is usually around 4 or 4:30.");
        });

    });

    suite("American to British English Translation", () => {

        test("Highlight translation in Mangoes are my favorite fruit.", () => {
            const { translation } = translator.translate(
                "Mangoes are my favorite fruit.",
                "american-to-british"
            );
            assert.strictEqual(
                translator.highlight("Mangoes are my favorite fruit.", translation),
                'Mangoes are my <span class="highlight">favourite</span> fruit.'
            );
        });

        test("Highlight translation in I ate yogurt for breakfast.", () => {
            const { translation } = translator.translate(
                "I ate yogurt for breakfast.",
                "american-to-british"
            );
            assert.strictEqual(
                translator.highlight("I ate yogurt for breakfast.", translation),
                'I ate <span class="highlight">yoghurt</span> for breakfast.'
            );
        });

        test("Highlight translation in We watched the footie match for a while.", () => {
            const { translation } = translator.translate(
                "We watched the footie match for a while.",
                "british-to-american"
            );
            assert.strictEqual(
                translator.highlight("We watched the footie match for a while.", translation),
                'We watched the <span class="highlight">soccer</span> match for a while.'
            );
        });

        test("Highlight translation in Paracetamol takes up to an hour to work.", () => {
            const { translation } = translator.translate(
                "Paracetamol takes up to an hour to work.",
                "british-to-american"
            );
            assert.strictEqual(
                translator.highlight("Paracetamol takes up to an hour to work.", translation),
                '<span class="highlight">Tylenol</span> takes up to an hour to work.'
            );
        });

    });
});
