// import { CreateDoubleDto } from './dto/create-double.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    const playersCount = await this.doublesModel.db
      .collection('players')
      .countDocuments();

    if (playersCount % 2 !== 0) {
      return { error: 'Not enough players to create doubles teams.' };
    }

    // get all players
    const playersGroup1 = await this.doublesModel.db
      .collection('players')
      .find({ group: 1 })
      .toArray();

    const playersGroup2 = await this.doublesModel.db
      .collection('players')
      .find({ group: 2 })
      .toArray();

    const randomPlayers1 = _.chain(playersGroup1).shuffle().value();
    const randomPlayers2 = _.chain(playersGroup2).shuffle().value();
    const randomDoubles = _.zip(randomPlayers1, randomPlayers2);

    // save the randomDoubles to the database
    for (const double of randomDoubles) {
      const newDoubles = new this.doublesModel({
        player1: double[0]?._id,
        player2: double[1]?._id,
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

  // Create a new doubles team
  // async create(createDoubleDto: CreateDoubleDto) {
  //   const newDoubles = new this.doublesModel({
  //     player1: createDoubleDto.player1,
  //     player2: createDoubleDto.player2,
  //   });
  //   return newDoubles.save();
  // }

  // Get a specific doubles team by ID
  // async findOne(id: string) {
  //   return this.doublesModel
  //     .findById(id)
  //     .populate('player1', 'name email') // Only get name and email fields
  //     .populate('player2', 'name email')
  //     .exec();
  // }

  // Update a doubles team
  // async update(id: string, updateDoubleDto: UpdateDoubleDto) {
  //   return this.doublesModel
  //     .findByIdAndUpdate(id, updateDoubleDto, { new: true })
  //     .populate('player1')
  //     .populate('player2')
  //     .exec();
  // }

  // Remove a doubles team
  // async remove(id: string) {
  //   return this.doublesModel.findByIdAndDelete(id).exec();
  // }
}
