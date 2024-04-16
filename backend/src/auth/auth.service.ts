import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt"


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService:JwtService) {}

    async signIn(username:string, pass:string) {
        const user = await this.userService.findOneByUsername(username)
        if(!user) {
            throw new UnauthorizedException("this user does not exist!");
        }
        const isPwValid = await bcrypt.compare(pass, user.password)
        if(!isPwValid){
            throw new UnauthorizedException("wrong password!");
        }

        const payload = {
            sub: user._id,
            email: user.email,
            roles: user.roles
        }

        return {
            access_token: await this.jwtService.signAsync(payload, {expiresIn: "1d"}),
        }

        
    }

}