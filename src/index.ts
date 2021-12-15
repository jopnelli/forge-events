import Resolver from '@forge/resolver';
import {LinkRequestItem} from "../types/types";
import {linkRequestItemSchemas} from "../remote/run/language/src/schema/linkage";
import {getLinks, putLinks} from "./persistence";
import {assertSchema} from "./validation";
import {ForgePageInvocationContext} from "./types";
import {asApp, route} from "@forge/api";
import {CqlSearchResult} from "../types/atlassian-types";

const resolver = new Resolver();

resolver.define("putLinks", async (req) => {
    assertSchema(linkRequestItemSchemas, req.payload);
    return await putLinks(req.payload as LinkRequestItem[]);
})

resolver.define("getLinks", async (req) => {
    const context = req.context as ForgePageInvocationContext;
    // TODO: page permission check as extension.content.id could be forged
    const links = await getLinks(context.extension.content.id);
    const pageIds = links.map(link => link.pageId);
    const response = await asApp().requestConfluence(route`/rest/api/search?cql=type=page and id in (${pageIds.join(",")})`);
    const searchResults: CqlSearchResult = await response.json();

    console.log({links});
    return links.map(link => {
        const searchResult = searchResults.results.find(result => result.content.id === link.pageId.toString());
        if (!searchResult) {
            return link;
        }
        const searchResultUrl = searchResults._links.context + searchResult.url;
        return {...link, url: searchResultUrl};
    });
});

export const handler = resolver.getDefinitions(); // exports backend function
