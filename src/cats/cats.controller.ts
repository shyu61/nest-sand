import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { CatsService } from './cats.service';
import { CreateCatDto, CreateCatDtoSchema } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';

@UseGuards(AuthGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateCatDtoSchema))
  create(@Body() createCatDto: CreateCatDto) {
    console.log(createCatDto);
    this.catsService.create(createCatDto);
  }

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Cat {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.catsService.remove(+id);
  }
}
