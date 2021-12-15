import {LanguageLinkInFirestore, LinkRequestItem} from "../types/types";
import {RequestInit} from "node-fetch";
import {APIResponse, fetch} from "@forge/api";

const getRemoteHostToken = () => process.env.DATABASE_TOKEN || "";
const getRemoteHostUrl = () => process.env.LOOPHOLE_HOST ? `https://${process.env.LOOPHOLE_HOST}.loophole.site` : "https://language-manager.seibert-media.net";

export async function putLinks(linkRequestItems: LinkRequestItem[]): Promise<number[]> {
    const response = await requestRemoteDatabase<number[]>({body: linkRequestItems, options: {method: "PUT"}});
    if (!response.ok) {
        throw new Error("Could not create links. " + await response.text())
    }
    return await response.json();
}

export async function getLinks(pageId: string): Promise<LanguageLinkInFirestore[]> {
    const response = await requestRemoteDatabase<number[]>({path: "page/" + pageId, options: {method: "GET"}});
    if (!response.ok) {
        throw new Error("Could not get links. " + await response.text())
    }
    return await response.json();
}

function requestRemoteDatabase<T>({
                                      path = "",
                                      body,
                                      options
                                  }: { path?: string, body?: object, options: RequestInit }): Promise<APIResponse & { json: () => Promise<T> }> {
    body && (options.body = JSON.stringify(body));
    return fetch(getRemoteHostUrl() + "/" + path, {
        headers: {
            "Authorization": getRemoteHostToken(),
        },
        ...options
    }) as Promise<APIResponse & { json: () => Promise<T> }>;
}
