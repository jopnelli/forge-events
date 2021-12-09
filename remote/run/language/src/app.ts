import Koa, {Next} from "koa";
import Router from '@koa/router';
import {AppContext} from "./app-types";
import Application from "koa";
import koaBody from "koa-body";
import {linkRequestItemSchemas} from "./schema/linkage";
import {validate} from "./middleware/validation";
import {LanguageLinkInFirestore, LinkRequestItem} from "../../../../types/types";

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
    const linkRequestItems: LinkRequestItem[] = ctx.request.body;
    const linkId: number = Math.min(...linkRequestItems.map(item => item.pageId));
    const languageLinks: LanguageLinkInFirestore[] = linkRequestItems.map(item => ({linkId, pageId: item.pageId, languageISO2: item.languageISO2}));
    const writes = languageLinks.map(link => {
        return ctx.authenticatedParentDoc.collection(LINK_COLLECTION).doc().create(link);
    });
    await Promise.all(writes);

    ctx.body = null;
});

// getLanguageLinksByLinkId
router.get("/:linkId", async ctx => {
    const {linkId} = ctx.params
    ctx.body = linkId;
});

// getViewableLanguageLinksByPage
router.get("/page/:pageId", async ctx => {
    const {pageId} = ctx.params
    const queryResult = await ctx.authenticatedParentDoc.collection(LINK_COLLECTION).where("pageId", "==", Number(pageId)).get();
    if (queryResult.empty) {
        ctx.throw(404, "language link not found");
        return;
    }
    const languageLink: LanguageLinkInFirestore = queryResult.docs[0].data() as LanguageLinkInFirestore;
    const linksQueryResult = await ctx.authenticatedParentDoc.collection(LINK_COLLECTION).where("linkId", "==", languageLink.linkId).get();
    const languageLinks = linksQueryResult.docs.map(doc => doc.data() as LanguageLinkInFirestore);
    ctx.body = languageLinks;
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
