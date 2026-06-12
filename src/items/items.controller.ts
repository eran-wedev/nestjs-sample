import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto): Item {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll(
    @Query('completed') completed?: string,
    @Query('q') q?: string,
  ): Item[] {
    const completedFilter =
      completed === 'true' ? true : completed === 'false' ? false : undefined;

    return this.itemsService.findAll({
      completed: completedFilter,
      q: q?.trim() || undefined,
    });
  }

  @Get('stats')
  getStats() {
    return this.itemsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Item {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Item {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.itemsService.remove(id);
  }
}
