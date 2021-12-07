import {Firestore} from '@google-cloud/firestore';
import Application from "koa";
import {AppContext} from "./app-types";

export function injectFirestoreAuthentication(app: Application<{}, AppContext>, firestore: Firestore): Application<{}, AppContext> {
    app.use(async (ctx, next) => {
        const authorizationHeader = ctx.request.headers.authorization;
        const tokensCommaSeperated = process.env.DATABASE_TOKENS; //"dev1:VkYp3s6v9y$B&E)H@McQfThWmZq4t7w!,prod:n2r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B"; // TODO: fetch from env
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
        ctx.authenticatedParentDoc = firestore.collection("scoped-data").doc(authenticatedFirestoreScope);
        await next();
    });
    return app;
}
