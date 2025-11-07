import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoublesService } from './doubles.service';
import { CreateDoubleDto } from './dto/create-double.dto';
import { UpdateDoubleDto } from './dto/update-double.dto';

@Controller('doubles')
export class DoublesController {
  constructor(private readonly doublesService: DoublesService) {}

  @Post()
  create(@Body() createDoubleDto: CreateDoubleDto) {
    return this.doublesService.create(createDoubleDto);
  }

  @Get()
  findAll() {
    return this.doublesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doublesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoubleDto: UpdateDoubleDto) {
    return this.doublesService.update(id, updateDoubleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doublesService.remove(id);
  }
}
