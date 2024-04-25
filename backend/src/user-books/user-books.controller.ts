import { Body, Controller, Post } from '@nestjs/common';
import {userBooksDTO} from "./user-books.validator";
import { UserBooksService } from './user-books.service';
import { JwToken } from 'src/Decorators/JwToken';
import { GetUserPipe } from 'src/Pipes/GetUserPipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user-books')
export class UserBooksController {
    constructor(private readonly userBooksService:UserBooksService) {}

    @Post()
    async openBook(@JwToken(GetUserPipe) userId:string, @Body() userBooksDTO: userBooksDTO) {
 
        return this.userBooksService.openBook(userBooksDTO, userId);

    }

    @Post("location")
    async updateLocation(@JwToken(GetUserPipe) userId:string, @Body() {location, bookId}: {location:string, bookId:string}) {
        return this.userBooksService.updateLocation(location, userId, bookId);
    }
}
