import { CreatePlayerDto } from './dto/create-player.dto';
import { getGroupPlayers } from 'src/utils/players';
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

  async findAll(): Promise<ReturnType<typeof getGroupPlayers>> {
    const players = await this.playerModel.find();
    return getGroupPlayers(players);
  }

  async createMultiple(
    players: CreatePlayerDto[],
  ): Promise<ReturnType<typeof getGroupPlayers>> {
    await this.deleteAll();
    const playersWithNames = players.filter((player) => player.name);
    const createdPlayers = await this.playerModel.insertMany(playersWithNames);
    return getGroupPlayers(createdPlayers);
  }

  async deleteAll() {
    return await this.playerModel.deleteMany();
  }

  // async findOne(id: string): Promise<Player | null> {
  //   return await this.playerModel.findOne({ _id: id });
  // }

  // async create(player: CreatePlayerDto): Promise<Player> {
  //   const newPlayer = new this.playerModel(player);
  //   return await newPlayer.save();
  // }

  // async delete(id: string): Promise<Player | null> {
  //   return await this.playerModel.findByIdAndDelete(id).exec();
  // }

  // async update(id: string, player: CreatePlayerDto): Promise<Player | null> {
  //   return await this.playerModel
  //     .findByIdAndUpdate(id, player, { new: true })
  //     .exec();
  // }
}
