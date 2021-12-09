import Joi from "joi";
import Application, {Next} from "koa";

export function validate(schema: Joi.Schema) {
    return async (ctx: Application.ExtendableContext, next: Next) => {
        try {
            Joi.assert(ctx.request.body, schema);
            await next();
        } catch (e: any) {
            ctx.body = Joi.isError(e) ? e.details : "Unknown validation error.";
            ctx.status = 400;
        }
    }
}
