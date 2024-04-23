import { Test, TestingModule } from '@nestjs/testing';
import { UserBooksController } from './user-books.controller';

describe('UserBooksController', () => {
  let controller: UserBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBooksController],
    }).compile();

    controller = module.get<UserBooksController>(UserBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
