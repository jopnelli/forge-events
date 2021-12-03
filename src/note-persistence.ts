import {storage} from "@forge/api";
import {Note} from "../types/note";

export function savePageNote({pageId, note}: { pageId: string, note: Note }) {
    if (!pageId) {
        throw new Error("No pageId provided.");
    }
    return storage.set("page-note-" + pageId, note);
}

export async function getPageNote({pageId}: { pageId: string }) {
    if (!pageId) {
        throw new Error("No pageId provided.");
    }
    return (await storage.get("page-note-" + pageId));
}
