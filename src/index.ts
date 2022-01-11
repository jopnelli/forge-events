import Resolver from '@forge/resolver';
import {LinkRequestItem} from "../types/types";
import {linkRequestItemSchemas} from "../remote/run/language/src/schema/linkage";
import {getLinks, putLinks} from "./persistence";
import {assertSchema} from "./validation";
import {ForgePageInvocationContext} from "./types";
import {asApp, route} from "@forge/api";
import {CqlSearchResult} from "../types/atlassian-types";
import {VALID_LANGUAGES} from "../types/valid-languages";

const resolver = new Resolver();

resolver.define("putLinks", async (req) => {
    assertSchema(linkRequestItemSchemas, req.payload);
    return await putLinks(req.payload as LinkRequestItem[]);
})

resolver.define("getLinks", async (req) => {
    const context = req.context as ForgePageInvocationContext;
    // TODO: page permission check as extension.content.id could be forged
    const links = await getLinks(req.payload.pageId || context.extension.content.id);
    const pageIds = links.map(link => link.pageId);
    const response = await asApp().requestConfluence(route`/rest/api/search?cql=id in (${pageIds.join(",")})`);
    const searchResults: CqlSearchResult = await response.json();
    return links.map(link => {
        const searchResult = searchResults.results.find(result => result.content.id === link.pageId.toString());
        if (!searchResult) {
            return link;
        }
        const searchResultUrl = searchResult.url;
        return {...link, url: searchResultUrl, base: searchResults._links.base};
    });
});

export const handler = resolver.getDefinitions(); // exports backend function

export const bylineproperties = async(context: any) => {
    const id = context.extension.content.id;
    const links = await getLinks(id);
    const tooltip = `See different languages of this content.`;
    let title = "Add languages";
    if (links.length) {
        title = VALID_LANGUAGES[links.find(link => link.pageId.toString() === id)!.languageISO2];
        if (links.length > 1) {
            title += ` (${links.length - 1} other language${links.length > 2 ? "s" : ""})`
        }
    }
    return {
        title,
        tooltip
    };
}
