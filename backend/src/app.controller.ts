import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';
import { AuthGuardQuery } from './auth/auth.guard.query';
import { AuthGuardHeader } from './auth/auth.guard.header';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("cover/:bookId")
  async serveCover(@Param('bookId') bookId: string, @Res() res: Response): Promise<any> {
      res.sendFile(join(__dirname,'..', '/uploads/archiv/covers', bookId));
  }

  @Get("book/:path")
  @UseGuards(AuthGuardQuery)
  async serveFile(@Param('path') path: string, @Res() res: Response): Promise<any> {
      res.sendFile(join(__dirname,'..', '/uploads/archiv', path));
    }
    
  @Get("bookbyId/:id")
  @UseGuards(AuthGuardHeader)
  async serveFileById(@Param('id') id: string, @Res() res: Response): Promise<any> {
      res.sendFile(join(__dirname,'..', '/uploads/archiv', id));
    }

}
