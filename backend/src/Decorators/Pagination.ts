import { createParamDecorator } from "@nestjs/common";

export const Pagination = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const limit = request.query.limit;
    const offset = request.query.offset;
    return { limit, offset };
});