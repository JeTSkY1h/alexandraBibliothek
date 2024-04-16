import { MongooseModule } from "@nestjs/mongoose";
import { userShema } from "./user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [MongooseModule.forFeature([{name: "user", schema: userShema,}])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}