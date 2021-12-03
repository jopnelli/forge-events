import Joi from "joi";

export const noteCreatePayloadSchema = Joi.object({
    msg: Joi.string().max(100),
}).unknown(false);

export interface NoteCreatePayload {
    msg: string,
}

export interface Note {
    msg: string,
    creator?: string
}
