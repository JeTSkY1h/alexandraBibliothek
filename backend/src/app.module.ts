import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BooksModule } from './books/books.module';
import { UserBooksModule } from './user-books/user-books.module';
import * as express from 'express';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:example@localhost:27017/Alexandra"),
    UserModule, 
    AuthModule, BooksModule, UserBooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}