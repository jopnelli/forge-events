import Resolver from '@forge/resolver';
import Joi from "joi";
import {noteCreatePayloadSchema, NoteCreatePayload} from "../types/note";
import {ForgePageInvocationContext} from "./types";
import {getPageNote, savePageNote} from "./note-persistence";

const resolver = new Resolver();

resolver.define("savePageNote", async (req) => {
    Joi.assert(req.payload, noteCreatePayloadSchema);
    const context = req.context as ForgePageInvocationContext;
    const note = req.payload as NoteCreatePayload;
    await savePageNote({
        pageId: context.extension.content.id,
        note: {msg: note.msg, creator: context.accountId},
    });
})

resolver.define("getPageNote", async (req) => {
    const context = req.context as ForgePageInvocationContext;
    return await getPageNote({pageId: context.extension.content.id}) || {msg: "No message set"};
})

export const handler = resolver.getDefinitions(); // exports backend function
