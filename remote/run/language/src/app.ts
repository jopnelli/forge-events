import Koa, {Next} from "koa";
import Router from '@koa/router';
import {AppContext} from "./app-types";
import Application from "koa";
import koaBody from "koa-body";
import {linkRequestItemSchemas} from "./schema/linkage";
import {validate} from "./middleware/validation";

const router = new Router<{}, AppContext>();

// TODO: remove
router.get('/', async ctx => {
    await ctx.authenticatedParentDoc.collection("access-log").doc().create({accessed: new Date()});
    ctx.body = null;
});

// TODO: remove
router.get('/test', async ctx => {
    await ctx.authenticatedParentDoc.collection("demo").doc("for-unit-test").set({hello: 123})
    ctx.body = "Hello World";
});

// updateLinking
router.put("/", validate(linkRequestItemSchemas), async ctx => {
    ctx.body = "Hello";
});

// getLanguageLinksByLinkId
router.get("/:linkId", async ctx => {
    const {linkId} = ctx.params
    ctx.body = linkId;
});

// getViewableLanguageLinksByPage
router.get("/page/:pageId", async ctx => {
    const {pageId} = ctx.params
    ctx.body = pageId;
});

// removeLinkFromPage
router.delete("/page/:pageId", async ctx => {
    const {pageId} = ctx.params
    ctx.body = pageId;
});

// addLinkBetweenPages
router.put("/page/:pageId", async ctx => {
    const {pageId} = ctx.params
    const {to} = ctx.query;
    ctx.body = {pageId, to};
});

export const composeApp = ({preRouterInjection}: { preRouterInjection: (app: Application<{}, AppContext>) => Application<{}, AppContext> }) => {
    const koa = new Koa<{}, AppContext>();
    koa.use(koaBody());
    preRouterInjection(koa);
    koa.use(router.routes()).use(router.allowedMethods());
    return koa;
}
