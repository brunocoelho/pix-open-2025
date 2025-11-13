import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyObject, Model } from 'mongoose';
import { Doubles } from './doubles.schema';
import _ from 'lodash';

@Injectable()
export class DoublesService {
  constructor(
    @InjectModel(Doubles.name) private doublesModel: Model<Doubles>,
  ) {}

  async deleteAll() {
    return this.doublesModel.deleteMany().exec();
  }

  async createRandomDoubles() {
    await this.deleteAll();

    // Get all players from group 1
    const allPlayers = await this.doublesModel.db
      .collection('players')
      .find({ group: 1 })
      .toArray();

    const playersCount = allPlayers.length;

    if (playersCount % 2 !== 0) {
      return { error: 'Not enough players to create doubles teams.' };
    }

    // Shuffle players and pair them
    const shuffledPlayers = _.shuffle(allPlayers);
    const randomDoubles: Array<[AnyObject, AnyObject]> = [];

    // Create pairs from shuffled players
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      randomDoubles.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }

    // Save the randomDoubles to the database
    for (const double of randomDoubles) {
      const newDoubles = new this.doublesModel({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        player1: double[0]._id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        player2: double[1]._id,
      });
      await newDoubles.save();
    }

    return this.doublesModel
      .find()
      .populate('player1')
      .populate('player2')
      .exec();
  }

  // Get all doubles teams with player details populated
  async findAll() {
    return this.doublesModel
      .find()
      .populate('player1')
      .populate('player2')
      .exec();
  }
}
