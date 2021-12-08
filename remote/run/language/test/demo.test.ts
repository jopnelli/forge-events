import request from 'supertest';
import {setupAppForIntegratedTesting} from "./setup";

const {app, parentDoc} = setupAppForIntegratedTesting();

test('Hello world works', async () => {
    const response = await request(app.callback()).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
    const documentSnapshot = await parentDoc.collection("demo").doc("for-unit-test").get()
    expect(documentSnapshot.data()).toEqual({"hello": 123});
});
