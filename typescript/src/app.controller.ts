import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// controllerはあくまでルーティングを行う場所。
// 実処理はserviceに記述し、DIする形。
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
