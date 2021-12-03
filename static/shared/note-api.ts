import {invoke} from "@forge/bridge";
import {Note, NoteCreatePayload} from "../../types/note";

export function savePageNote(note: NoteCreatePayload) {
    return invoke("savePageNote", note)
}

export function getPageNote() {
    return invoke<Note>("getPageNote")
}
