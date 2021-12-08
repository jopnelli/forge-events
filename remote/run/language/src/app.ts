import Koa, {Next} from "koa";
import Router from '@koa/router';
import {AppContext} from "./app-types";
import Application from "koa";

const router = new Router<{}, AppContext>();

router.get('/', async (ctx, next: Next) => {
    await ctx.authenticatedParentDoc.collection("access-log").doc().create({accessed: new Date()});
    ctx.body = null;
});

router.get('/test', async (ctx, next: Next) => {
    await ctx.authenticatedParentDoc.collection("demo").doc("for-unit-test").set({hello: 123})
    ctx.body = "Hello World";
});

export const composeApp = ({preRouterInjection}: { preRouterInjection: (app: Application<{}, AppContext>) => Application<{}, AppContext> }) => {
    const koa = new Koa<{}, AppContext>();
    preRouterInjection(koa);
    koa.use(router.routes()).use(router.allowedMethods());
    return koa;
}
