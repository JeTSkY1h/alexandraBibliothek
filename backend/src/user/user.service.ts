import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.model";

interface IUser {
    email: string;
    password: string;
    username: string;
}


@Injectable()
export class UserService {
    constructor(@InjectModel("user") private readonly userModel: Model<User>) {}
    
    async getUsers() {
        const users = await this.userModel.find()
        return users
    }

    async insertUser(user: IUser, password: string) {
        
        user.password = password;
        const newUser = new this.userModel({
            ...user
        })
        console.log(newUser);

        const savedUser = newUser.save().then(res=>res).catch(err=>{
            if(err.code === 11000) {
                const field = Object.keys(err.keyValue)[0]
                throw new BadRequestException(`The ${field}: ${err.keyValue[field]} is already taken!`)
            }
        })
        return savedUser;
    }

    async findOneByUsername(username:string) {
        const user = await this.userModel.findOne({username})
        return user
    }

    async findOneByEmail(email:string) {
        const user = await this.userModel.findOne({email})
        return user
    }
}