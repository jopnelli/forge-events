import {Schema} from "joi";

/**
 * to be used in Forge lambda implementations to validate user input with Joi
 * @param schema
 * @param value
 */
export function assertSchema(schema: Schema, value: any) {
    const {error} = schema.validate(value);
    if (error) {
        throw new Error(JSON.stringify(error.details))
    }
}
