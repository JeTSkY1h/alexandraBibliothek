import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GetUserPipe {
    constructor(private readonly jwtService:JwtService){}
    
    async transform(token: string) {

        const payload = await this.jwtService.verifyAsync(token);
        console.log(payload);
        return payload["sub"]

    }
    
}