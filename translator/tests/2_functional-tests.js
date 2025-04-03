const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with text and locale fields', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Mangoes are my favorite fruit.", locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.equal(res.body.text, 'Mangoes are my favorite fruit.');
                assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
                done();
            });
    });

    test('Translation with text and invalid locale fields', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Mangoes are my favorite fruit.", locale: 'invalid-locale' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });

    test('Translation with missing text field', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with missing locale field', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Mangoes are my favorite fruit." })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with empty text', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "", locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });

    test('Translation with text that needs no translation', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Paracetamol takes up to an hour to work.", locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.equal(res.body.text, "Paracetamol takes up to an hour to work.");
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });


    //! test suite

    test('Translation of "Mr." title from American to British English', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "No Mr. Bond, I expect you to die.", locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'No Mr Bond, I expect you to die.');
                done();
            });
    });

    test('Translation of "Dr." title from American to British English', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Dr. Grosh will see you now.", locale: 'american-to-british' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'Dr Grosh will see you now.');
                done();
            });
    });

    test('Translation of "Mrs." title from British to American English', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Have you met Mrs Kalyani?", locale: 'british-to-american' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'Have you met Mrs. Kalyani?');
                done();
            });
    });

    test('Translation of "Prof." title from British to American English', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({ text: "Prof Joyner of King's College, London.", locale: 'british-to-american' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'translation');
                assert.equal(res.body.translation, 'Prof. Joyner of King\'s College, London.');
                done();
            });
    });

});
