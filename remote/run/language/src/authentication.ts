import {Firestore} from '@google-cloud/firestore';
import Application from "koa";
import {AppContext} from "./app-types";

export function injectFirestoreAuthentication(app: Application<{}, AppContext>, firestore: Firestore): Application<{}, AppContext> {
    app.use(async (ctx, next) => {
        const forgeInstallationContextHeader = ctx.request.headers["x-forge-context"];
        const authorizationHeader = ctx.request.headers.authorization;
        if (Array.isArray(forgeInstallationContextHeader) || Array.isArray(authorizationHeader)) {
            ctx.throw(400, "Invalid auth. headers");
            return;
        }
        if (!forgeInstallationContextHeader) {
            ctx.throw(400, "Missing Forge Context");
            return;
        }
        const decodedForgeContext = decodeForgeContext(forgeInstallationContextHeader);
        const tokensCommaSeperated = process.env.DATABASE_TOKENS || process.env.FORGE_USER_VAR_DATABASE_TOKEN; //"dev1:VkYp3s6v9y$B&E)H@McQfThWmZq4t7w!,prod:n2r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B"; // TODO: fetch from env
        const matchingSecret = tokensCommaSeperated?.replace(/(\r\n|\n|\r)/gm, "")
            .split(",")
            .find(secret => secret === authorizationHeader);
        if (!matchingSecret) {
            ctx.throw(401, "Unauthenticated");
            return;
        }
        const authenticatedFirestoreScope = matchingSecret.split(":")[0];
        if (!authenticatedFirestoreScope) {
            ctx.throw(501);
            return;
        }
        ctx.authenticatedParentDoc = firestore.collection("scoped-data").doc(authenticatedFirestoreScope).collection("tenants").doc(decodedForgeContext);
        await next();
    });
    return app;
}

function decodeForgeContext(forgeContext: string) {
    return new Buffer(forgeContext).toString("base64");
}
