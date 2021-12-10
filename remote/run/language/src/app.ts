import Koa from "koa";
import Application from "koa";
import Router from '@koa/router';
import {AppContext} from "./app-types";
import koaBody from "koa-body";
import {linkRequestItemSchemas} from "./schema/linkage";
import {validate} from "./middleware/validation";
import {LanguageLinkInFirestore, LinkRequestItem} from "../../../../types/types";
import {languageLinkPersistence} from "./persistence/linkage";

const router = new Router<{}, AppContext>();
const LINK_COLLECTION = "links";

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
    const {authenticatedParentDoc} = ctx;
    const linkRequestItems: LinkRequestItem[] = ctx.request.body;
    ctx.body = await languageLinkPersistence({authenticatedParentDoc}).updateLinks(linkRequestItems);
});

// getLanguageLinksByLinkId
router.get("/:linkId", async ctx => {
    const {linkId} = ctx.params
    ctx.body = linkId;
});

// getViewableLanguageLinksByPage
router.get("/page/:pageId", async ctx => {
    const {authenticatedParentDoc} = ctx;
    const {pageId} = ctx.params
    const pageIdAsNumber: number = Number(pageId);
    Number.isNaN(pageIdAsNumber) && ctx.throw(400, "Bad pageId");
    ctx.body = await languageLinkPersistence({authenticatedParentDoc}).getLinksByPageId({pageId: Number(pageId)});
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
