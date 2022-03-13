import { Injectable } from '@nestjs/common';

// providerとしての役割。controllerにDIされる。
// Injectableデコレータが必要。
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
