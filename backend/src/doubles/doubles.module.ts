import { Doubles, DoublesSchema } from './doubles.schema';
import { DoublesController } from './doubles.controller';
import { DoublesService } from './doubles.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doubles.name, schema: DoublesSchema }]),
  ],
  controllers: [DoublesController],
  providers: [DoublesService],
})
export class DoublesModule {}
