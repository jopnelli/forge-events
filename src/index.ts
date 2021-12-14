import Resolver from '@forge/resolver';
import {LinkRequestItem} from "../types/types";
import {linkRequestItemSchemas} from "../remote/run/language/src/schema/linkage";
import {getLinks, putLinks} from "./persistence";
import {assertSchema} from "./validation";
import {ForgePageInvocationContext} from "./types";

const resolver = new Resolver();

resolver.define("putLinks", async (req) => {
    assertSchema(linkRequestItemSchemas, req.payload);
    return await putLinks(req.payload as LinkRequestItem[]);
})

resolver.define("getLinks", async (req) => {
    const context = req.context as ForgePageInvocationContext;
    // TODO: page permission check as extension.content.id could be forged
    const links = await getLinks(context.extension.content.id);
    console.log({links});
    return links;
})

export const handler = resolver.getDefinitions(); // exports backend function
