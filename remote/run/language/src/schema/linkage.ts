import Joi from "joi";

export const linkRequestItemSchemas = Joi.array().items(Joi.object({
    pageId: Joi.number(),
    languageISO2: Joi.string(),
    contentType: Joi.string().valid("blogpost", "page"),
    spaceKey: Joi.string()
}));
