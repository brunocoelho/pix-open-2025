import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { DoublesModule } from './doubles/doubles.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/pix-open-2025'),
    PlayersModule,
    DoublesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
