import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common";
import { UserService } from "./user.service";

import * as bcrypt from "bcrypt"
import { AuthGuard } from "../auth/auth.guard";
import { userDTO } from "./user.validator";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("")
    async getUsers() {
        return this.userService.getUsers();
    }

    @Post("")
    async addUser( @Body() user: userDTO) {
        const saltOrRounds = 10;
        const hashedPw = await bcrypt.hash(user.password, saltOrRounds)
        const res = await this.userService.insertUser(
            user,
            hashedPw
        )
        return {
            msg: "User registration was successfull!"
        };
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return req.user
    }
}