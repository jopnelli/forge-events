import {Firestore} from '@google-cloud/firestore';
import {injectFirestoreAuthentication} from "./authentication";
import {composeApp} from "./app";

const emulatorProjectId = process.env.EMULATOR_PROJECT_ID;

const firestore = new Firestore(emulatorProjectId ? {
    projectId: emulatorProjectId,
    host: 'localhost',
    port: 8010,
    ssl: false
} : {});

composeApp({
    preRouterInjection: app => injectFirestoreAuthentication(app, firestore)
}).listen(8080)
