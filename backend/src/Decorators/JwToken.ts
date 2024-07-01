import { UnauthorizedException, createParamDecorator, ExecutionContext } from "@nestjs/common"
import { isJWT } from "class-validator";

export const JwToken = createParamDecorator((data: unknown, ctx: ExecutionContext):string => {
    const request = ctx.switchToHttp().getRequest()

    if(
        typeof request.headers !== 'object' ||
        typeof request.headers.authorization !== 'string' ||
        !isJWT(request.headers.authorization.split(' ')[1])
    ) {
        throw new UnauthorizedException('Invalid token');
    }

    return request.headers.authorization.split(' ')[1];
    

});

