import { Injectable } from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  create(createCatDto: CreateCatDto) {
    this.cats.push({ ...createCatDto, id: this.cats.length + 1 });
  }

  findAll() {
    return this.cats;
  }

  findOne(id: number) {
    return this.cats.find((cat) => cat.id === id);
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    this.cats = this.cats.map((cat) =>
      cat.id === id ? { ...cat, ...updateCatDto } : cat,
    );
  }

  remove(id: number) {
    this.cats = this.cats.filter((cat) => cat.id !== id);
  }
}
