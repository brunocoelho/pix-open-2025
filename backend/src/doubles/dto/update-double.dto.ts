import { PartialType } from '@nestjs/mapped-types';
import { CreateDoubleDto } from './create-double.dto';

export class UpdateDoubleDto extends PartialType(CreateDoubleDto) {}
