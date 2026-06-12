import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10 + (days % 5), 30, 0, 0);
  return date;
}

@Injectable()
export class ItemsService {
  private items: Item[] = [
    {
      id: 1,
      name: 'Learn NestJS',
      description: 'Build a small REST API with modules and services',
      completed: true,
      createdAt: daysAgo(6),
    },
    {
      id: 2,
      name: 'Try the items API',
      description: 'Create, read, update, and delete items',
      completed: false,
      createdAt: daysAgo(5),
    },
    {
      id: 3,
      name: 'Ship the dashboard',
      description: 'Visualize live stats and activity charts',
      completed: false,
      createdAt: daysAgo(2),
    },
    {
      id: 4,
      name: 'Write e2e tests',
      description: 'Cover the items CRUD endpoints',
      completed: true,
      createdAt: daysAgo(1),
    },
    {
      id: 5,
      name: 'Deploy to production',
      description: 'Use Mau or your preferred platform',
      completed: false,
      createdAt: daysAgo(0),
    },
  ];

  private nextId = 6;

  create(createItemDto: CreateItemDto): Item {
    const item: Item = {
      id: this.nextId++,
      name: createItemDto.name,
      description: createItemDto.description,
      completed: createItemDto.completed ?? false,
      createdAt: new Date(),
    };

    this.items.push(item);
    return item;
  }

  findAll(filters?: { completed?: boolean; q?: string }): Item[] {
    let result = this.items;

    if (filters?.completed !== undefined) {
      result = result.filter((item) => item.completed === filters.completed);
    }

    if (filters?.q) {
      const query = filters.q.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query),
      );
    }

    return result;
  }

  getStats() {
    const completed = this.items.filter((item) => item.completed).length;
    const pending = this.items.length - completed;

    const byDay = this.items.reduce<Record<string, number>>((acc, item) => {
      const day = item.createdAt.toISOString().slice(0, 10);
      acc[day] = (acc[day] ?? 0) + 1;
      return acc;
    }, {});

    const activity = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    const maxDaily = Math.max(...Object.values(byDay), 1);
    const last24h = this.items.filter(
      (item) => Date.now() - item.createdAt.getTime() < 86_400_000,
    ).length;

    return {
      total: this.items.length,
      completed,
      pending,
      completionRate: this.items.length
        ? Math.round((completed / this.items.length) * 100)
        : 0,
      activity,
      maxDaily,
      velocity: {
        last24h,
        avgPerDay: activity.length
          ? Math.round((this.items.length / activity.length) * 10) / 10
          : 0,
      },
    };
  }

  findOne(id: number): Item {
    const item = this.items.find((entry) => entry.id === id);

    if (!item) {
      throw new NotFoundException(`Item #${id} not found`);
    }

    return item;
  }

  update(id: number, updateItemDto: UpdateItemDto): Item {
    const item = this.findOne(id);
    Object.assign(item, updateItemDto);
    return item;
  }

  remove(id: number): Item {
    const index = this.items.findIndex((entry) => entry.id === id);

    if (index === -1) {
      throw new NotFoundException(`Item #${id} not found`);
    }

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}
