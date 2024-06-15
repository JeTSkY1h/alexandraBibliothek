import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';
import { AuthGuard } from './auth/auth.guard';

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
  @UseGuards(AuthGuard)
  async serveFile(@Param('path') path: string, @Res() res: Response): Promise<any> {
      res.sendFile(join(__dirname,'..', '/uploads/archiv', path));
    }
    
  @Get("bookbyId/:id")
  @UseGuards(AuthGuard)
  async serveFileById(@Param('id') id: string, @Res() res: Response): Promise<any> {
      res.sendFile(join(__dirname,'..', '/uploads/archiv', id));
    }

}
