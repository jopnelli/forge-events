import Koa from "koa";
import Application from "koa";
import Router from '@koa/router';
import {AppContext} from "./app-types";
import koaBody from "koa-body";
import {linkRequestItemSchemas} from "./schema/linkage";
import {assertSchema} from "./middleware/validation";
import {LinkRequestItem} from "../../../../types/types";
import {languageLinkPersistence} from "./persistence/linkage";

const router = new Router<{}, AppContext>();

router.put("/", assertSchema(linkRequestItemSchemas), async ctx => {
    const {authenticatedParentDoc} = ctx;
    const linkRequestItems: LinkRequestItem[] = ctx.request.body;
    const persistence = languageLinkPersistence({authenticatedParentDoc});
    ctx.body = await persistence.updateLinks(linkRequestItems);
});

router.get("/page/:pageId", async ctx => {
    const {authenticatedParentDoc} = ctx;
    const {pageId} = ctx.params
    const pageIdAsNumber: number = Number(pageId);
    (Number.isNaN(pageIdAsNumber) || pageIdAsNumber === 0) && ctx.throw(400, "Bad pageId");
    const persistence = languageLinkPersistence({authenticatedParentDoc});
    ctx.body = await persistence.getLinksByPageId({pageId: Number(pageId)});
});

export const composeApp = ({preRouterInjection}: { preRouterInjection: (app: Application<{}, AppContext>) => Application<{}, AppContext> }) => {
    const koa = new Koa<{}, AppContext>();
    koa.use(koaBody());
    preRouterInjection(koa);
    koa.use(router.routes()).use(router.allowedMethods());
    return koa;
}
