import {invoke} from "@forge/bridge";
import {LanguageLinkInFirestore, LinkRequestItem} from "../../types/types";

export function createLinks(linkRequestItems: LinkRequestItem[]) {
    return invoke<number[]>("putLinks", linkRequestItems);
}

export function getLinks() {
    return invoke<(LanguageLinkInFirestore & { url?: string })[]>("getLinks");
}
