import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express"
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthGuardQuery implements CanActivate {

    constructor(private jwtService: JwtService) {}
    
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const token = this.getToken(req)
        if(!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token
            );
            req['user'] = payload;
        } catch (err) {
            if(err instanceof jwt.TokenExpiredError)
                throw new UnauthorizedException("token expired");
            throw new UnauthorizedException();
        }
        return true
    }
        
    private getToken(req: Request): string | null {
        const token = req.query.token as string;
        console.log(token)
        return token ? token : null;
    }
    

}
