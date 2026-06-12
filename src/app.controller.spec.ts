import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('api', () => {
    it('should return API welcome info', () => {
      expect(appController.getHello()).toEqual({
        message: 'Welcome to the NestJS sample API',
        endpoints: expect.objectContaining({
          dashboard: 'GET /',
          health: 'GET /api',
          items: expect.any(Object),
        }),
      });
    });
  });
});
