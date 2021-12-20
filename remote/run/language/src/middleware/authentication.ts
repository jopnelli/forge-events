import {Firestore} from '@google-cloud/firestore';
import Application from 'koa';
import {AppContext} from '../app-types';

// TODO: add unit test
export function injectFirestoreAuthentication(app: Application<{}, AppContext>, firestore: Firestore) {
  app.use(async (ctx: Application.ExtendableContext & { state: {} } & AppContext & { body: any; response: { body: any } }, next) => {
    const forgeInstallationContextHeader = ctx.request.headers['x-forge-context'];
    const authorizationHeader = ctx.request.headers.authorization;
    if (Array.isArray(forgeInstallationContextHeader) || Array.isArray(authorizationHeader)) {
      ctx.throw(400, 'Invalid auth. headers');
      return;
    }
    if (!forgeInstallationContextHeader) {
      ctx.throw(400, 'Missing Forge Context');
      return;
    }
    if (!authorizationHeader) {
      ctx.throw(401, 'Unauthenticated');
      return;
    }
    const decodedForgeContext = decodeForgeContext(forgeInstallationContextHeader);
    const tokensCommaSeperated = process.env.DATABASE_TOKENS || process.env.FORGE_USER_VAR_DATABASE_TOKEN; // format: "dev1:xxpwd,prod:yypwd";
    const matchingSecret = tokensCommaSeperated?.replace(/(\r\n|\n|\r)/gm, '')
        .split(',')
        .find((secret) => secret === authorizationHeader);
    if (!matchingSecret) {
      ctx.throw(401, 'Unauthenticated');
      return;
    }
    const authenticatedFirestoreScope = matchingSecret.split(':')[0];
    if (!authenticatedFirestoreScope) {
      ctx.throw(501);
      return;
    }
    ctx.authenticatedParentDoc = firestore
        .collection('scoped')
        .doc(authenticatedFirestoreScope) // different app(-environments)
        .collection('tenants')
        .doc(decodedForgeContext); // different installation contexts / tenants
    await next();
  });
  return app;
}

function decodeForgeContext(forgeContext: string) {
  return Buffer.from(forgeContext).toString('base64');
}
