import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Player } from 'src/players/players.schema';

@Schema({ timestamps: true })
export class Doubles extends Document {
  @Prop({ type: Types.ObjectId, ref: Player.name, required: true })
  player1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Player.name, required: true })
  player2: Types.ObjectId;
}

export const DoublesSchema = SchemaFactory.createForClass(Doubles);
