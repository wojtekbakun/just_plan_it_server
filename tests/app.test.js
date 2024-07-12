const supertest = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
    timeoutInMilliseconds = 20000;
    describe('Welcome message', () => {
        test('It should respond with a welcome message', async () => {
            const response = await supertest(app).get('/');
            expect(response.text).toBe('Welcome in Calend.ai!!');
        })
    })
    describe('Generate plan', () => {
        test('It should generate plan and upload to Firestore (learn love letter writing in 3 days)', async () => {
            const dataInput = 'I want to learn love letter writing in 3 days. I have no other plans.';
            const response = await supertest(app).post('/generatePlan').send({ userInput: dataInput });
            expect(response.text).toBe('Plan successfully generated and uploaded to Firestore!');
            //expect(response.headers)['content-type'].toBe(expect.stringContaining('json'));
        }, timeoutInMilliseconds)
    })
});