import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { getGroupPlayers } from 'src/utils/players';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(): Promise<ReturnType<typeof getGroupPlayers>> {
    return this.playersService.findAll();
  }

  @Post('multiple')
  createMultiple(
    @Body() createPlayerDtos: CreatePlayerDto[],
  ): Promise<ReturnType<typeof getGroupPlayers>> {
    return this.playersService.createMultiple(createPlayerDtos);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Player | null> {
  //   return this.playersService.findOne(id);
  // }

  // @Post()
  // create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
  //   return this.playersService.create(createPlayerDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string): Promise<Player | null> {
  //   return this.playersService.delete(id);
  // }

  // @Delete()
  // deleteAll(): Promise<{ deletedCount?: number }> {
  //   return this.playersService.deleteAll();
  // }

  // @Put(':id')
  // update(
  //   @Body() updatePlayerDto: CreatePlayerDto,
  //   @Param('id') id: string,
  // ): Promise<Player | null> {
  //   return this.playersService.update(id, updatePlayerDto);
  // }
}
