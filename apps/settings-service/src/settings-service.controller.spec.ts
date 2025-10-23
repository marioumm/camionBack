import { Test, TestingModule } from '@nestjs/testing';
import { SettingsServiceController } from './settings-service.controller';
import { SettingsServiceService } from './settings-service.service';

describe('SettingsServiceController', () => {
  let settingsServiceController: SettingsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SettingsServiceController],
      providers: [SettingsServiceService],
    }).compile();

    settingsServiceController = app.get<SettingsServiceController>(SettingsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(settingsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
