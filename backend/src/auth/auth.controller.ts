import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("login")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("")
    async login(@Body("email") email:string, @Body("password") password:string ) {
        return this.authService.signIn(email, password)
    }

}