import { CreatePlayerDto } from './dto/create-player.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPlayer } from './interfaces/player.interface';
import { Model } from 'mongoose';
import { Player } from './players.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<IPlayer>,
  ) {}

  async findAll(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async findOne(id: string): Promise<Player | null> {
    return await this.playerModel.findOne({ _id: id });
  }

  async create(player: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(player);
    return await newPlayer.save();
  }

  async delete(id: string): Promise<Player | null> {
    return await this.playerModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, player: CreatePlayerDto): Promise<Player | null> {
    return await this.playerModel
      .findByIdAndUpdate(id, player, { new: true })
      .exec();
  }
}
