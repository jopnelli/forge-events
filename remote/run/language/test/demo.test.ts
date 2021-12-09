import request from 'supertest';
import {setupAppForIntegratedTesting} from "./setup";

const {app, parentDoc} = setupAppForIntegratedTesting();

describe('PUT /', () => {
    test('accepts valid link request', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 2, languageISO2: "en"}
        ]);
        expect(response.status).toBe(204);
    });

    test('accepts valid link requests', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 2, languageISO2: "en"},
            {pageId: 3, languageISO2: "fr"},
            {pageId: 4, languageISO2: "de"}
        ]);
        expect(response.status).toBe(204);
    });

    test('rejects link requests with duplicate page id', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 2, languageISO2: "en"},
            {pageId: 2, languageISO2: "de"}
        ]);
        expect(response.status).toBe(400);
    });

    test('rejects link requests with duplicate language', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 2, languageISO2: "en"},
            {pageId: 3, languageISO2: "en"}
        ]);
        expect(response.status).toBe(400);
    });

    test('rejects link request with invalid language code', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 2, languageISO2: "xx"}
        ]);
        expect(response.status).toBe(400);
    });

    test('rejects link requests which exceeds MAX_LINKS=10', async () => {
        const response = await request(app.callback()).put("/").send([
            {pageId: 1, languageISO2: "ru"},
            {pageId: 2, languageISO2: "en"},
            {pageId: 3, languageISO2: "fr"},
            {pageId: 4, languageISO2: "es"},
            {pageId: 5, languageISO2: "hr"},
            {pageId: 6, languageISO2: "ch"},
            {pageId: 7, languageISO2: "zu"},
            {pageId: 8, languageISO2: "fi"},
            {pageId: 9, languageISO2: "it"},
            {pageId: 10, languageISO2: "pt"},
            {pageId: 11, languageISO2: "lt"}
        ]);
        expect(response.status).toBe(400);
        expect(JSON.stringify(response.body)).toContain("must contain less than or equal to 10 items");
    });

    test('writes valid language links to database', async () => {
        const payload = [
            {pageId: 1, languageISO2: "ru"},
            {pageId: 2, languageISO2: "en"},
            {pageId: 3, languageISO2: "fr"}
        ];
        const response = await request(app.callback()).put("/").send(payload);

        expect(response.status).toBe(204);

        const languageLinks = await request(app.callback()).get("/page/1");
        expect(languageLinks.body).toEqual(expect.arrayContaining(payload.map(p => ({...p, linkId: 1}))));
    });
});
