import Joi from 'joi';
import {VALID_LANGUAGES} from '../../../../../types/valid-languages';

const MAX_LINKS = 10;

export const linkRequestItemSchemas = Joi.array().items(Joi.object({
  pageId: Joi.number(),
  languageISO2: Joi.string().valid(...Object.keys(VALID_LANGUAGES)),
})).max(MAX_LINKS).unique((x, y) => x.pageId === y.pageId || x.languageISO2 === y.languageISO2);
