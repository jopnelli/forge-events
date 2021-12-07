import Koa, {Next} from "koa";
import Router from '@koa/router';
import {Firestore} from '@google-cloud/firestore';
import {AppContext} from "./app-types";
import {injectFirestoreAuthentication} from "./authentication";

const app = new Koa<{}, AppContext>();
const router = new Router<{}, AppContext>();

const emulatorProjectId = process.env.EMULATOR_PROJECT_ID;

const firestore = new Firestore(emulatorProjectId ? {
    projectId: emulatorProjectId,
    host: 'localhost',
    port: 8010,
    ssl: false
} : {});

router.get('/', async (ctx, next: Next) => {
    await ctx.authenticatedParentDoc.collection("access-log").doc().create({accessed: new Date()});
    ctx.body = null;
});

injectFirestoreAuthentication(app, firestore)
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080);
