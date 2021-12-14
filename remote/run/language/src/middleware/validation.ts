import Joi from "joi";
import Application, {Next} from "koa";

export function assertSchema(schema: Joi.Schema) {
    return async (ctx: Application.ExtendableContext, next: Next) => {
        const {error} = schema.validate(ctx.request.body);
        if (error) {
            ctx.body = error.details;
            ctx.status = 400;
            return;
        }
        await next();
    }
}
