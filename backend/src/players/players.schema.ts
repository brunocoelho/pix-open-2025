import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  group: 1 | 2;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
