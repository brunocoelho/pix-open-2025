import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { Player } from './players.schema';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Player | null> {
    return this.playersService.findOne(id);
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Player | null> {
    return this.playersService.delete(id);
  }

  @Put(':id')
  update(
    @Body() updatePlayerDto: CreatePlayerDto,
    @Param('id') id: string,
  ): Promise<Player | null> {
    return this.playersService.update(id, updatePlayerDto);
  }
}
