import {composeApp} from "../src/app";
import {Firestore} from "@google-cloud/firestore";

export function setupAppForIntegratedTesting() {
    const firestore = new Firestore({
        projectId: process.env.EMULATOR_PROJECT_ID,
        host: 'localhost',
        port: 8010,
        ssl: false
    })

    const parentDoc = firestore.collection("scoped")
        .doc("unit-test-scope")
        .collection("tenants")
        .doc("unit-test-forge-context");

    afterEach(async () => {
        await firestore.recursiveDelete(parentDoc)
    })

    const app = composeApp({
        preRouterInjection(app) {
            app.use(async (ctx, next) => {
                ctx.authenticatedParentDoc = parentDoc;
                await next();
            });
            return app;
        }
    });

    return {app, parentDoc}

}
