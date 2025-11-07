import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index(): string {
    return 'Bem vindo ao Pix Open 2025!';
  }
}
