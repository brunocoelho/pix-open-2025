import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  name: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
