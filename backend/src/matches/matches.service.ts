import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './matches.schema';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(@InjectModel(Match.name) private matchModel: Model<Match>) {}

  // Create a new match
  async create(createMatchDto: CreateMatchDto) {
    const newMatch = new this.matchModel(createMatchDto);
    return newMatch.save();
  }

  // Get all matches with populated double details
  async findAll() {
    return this.matchModel
      .find()
      .populate({
        path: 'double1',
        populate: [
          { path: 'player1', select: 'name' },
          { path: 'player2', select: 'name' },
        ],
      })
      .populate({
        path: 'double2',
        populate: [
          { path: 'player1', select: 'name' },
          { path: 'player2', select: 'name' },
        ],
      })
      .sort({ round: 1, position: 1 })
      .exec();
  }

  // Update a match
  async update(id: string, updateMatchDto: UpdateMatchDto) {
    return this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .populate({
        path: 'double1',
        populate: [
          { path: 'player1', select: 'name' },
          { path: 'player2', select: 'name' },
        ],
      })
      .populate({
        path: 'double2',
        populate: [
          { path: 'player1', select: 'name' },
          { path: 'player2', select: 'name' },
        ],
      })
      .exec();
  }
}
