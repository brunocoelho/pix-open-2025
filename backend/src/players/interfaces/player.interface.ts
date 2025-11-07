import { Document } from 'mongoose';

export interface IPlayer extends Document {
  group: 1 | 2;
  name: string;
}
