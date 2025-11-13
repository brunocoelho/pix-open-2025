import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doubles } from 'src/doubles/doubles.schema';

export type RoundType = 'R16' | 'R8' | 'SEMI' | 'FINAL';

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ type: Types.ObjectId, ref: Doubles.name })
  double1: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Doubles.name })
  double2: Types.ObjectId;

  @Prop({ type: String })
  scoreDouble1: string;

  @Prop({ type: String })
  scoreDouble2: string;

  @Prop({ enum: ['R16', 'R8', 'SEMI', 'FINAL'] })
  round: RoundType;

  @Prop({ type: Number })
  position: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
