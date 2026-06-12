import { NotFoundException } from '@nestjs/common';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(() => {
    service = new ItemsService();
  });

  describe('findAll', () => {
    it('returns a copy that does not mutate internal state', () => {
      const items = service.findAll();
      items.pop();

      expect(service.findAll().length).toBeGreaterThan(items.length);
    });

    it('filters by completed status', () => {
      const pending = service.findAll({ completed: false });

      expect(pending.length).toBeGreaterThan(0);
      expect(pending.every((item) => !item.completed)).toBe(true);
    });

    it('filters by search query', () => {
      const matches = service.findAll({ q: 'nestjs' });

      expect(matches.length).toBeGreaterThan(0);
      expect(
        matches.some((item) => item.name.toLowerCase().includes('nestjs')),
      ).toBe(true);
    });

    it('combines completed and search filters', () => {
      const matches = service.findAll({ completed: true, q: 'nestjs' });

      expect(matches.every((item) => item.completed)).toBe(true);
      expect(
        matches.every(
          (item) =>
            item.name.toLowerCase().includes('nestjs') ||
            item.description?.toLowerCase().includes('nestjs'),
        ),
      ).toBe(true);
    });
  });

  describe('create', () => {
    it('adds an item with an incrementing id', () => {
      const before = service.findAll().length;
      const created = service.create({ name: 'Unit test item' });

      expect(created).toMatchObject({
        id: expect.any(Number),
        name: 'Unit test item',
        completed: false,
      });
      expect(service.findAll().length).toBe(before + 1);
    });
  });

  describe('findOne', () => {
    it('returns a copy of the item', () => {
      const item = service.findOne(1);

      item.name = 'Mutated';
      expect(service.findOne(1).name).not.toBe('Mutated');
    });

    it('throws when the item does not exist', () => {
      expect(() => service.findOne(9999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('persists changes to the store', () => {
      service.update(2, { completed: true });

      expect(service.findOne(2).completed).toBe(true);
    });
  });

  describe('remove', () => {
    it('removes the item from the store', () => {
      const before = service.findAll().length;
      service.remove(1);

      expect(service.findAll().length).toBe(before - 1);
      expect(() => service.findOne(1)).toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('returns aggregated metrics', () => {
      const stats = service.getStats();

      expect(stats).toMatchObject({
        total: expect.any(Number),
        completed: expect.any(Number),
        pending: expect.any(Number),
        completionRate: expect.any(Number),
        maxDaily: expect.any(Number),
        activity: expect.any(Array),
        velocity: {
          last24h: expect.any(Number),
          avgPerDay: expect.any(Number),
        },
      });
      expect(stats.completed + stats.pending).toBe(stats.total);
    });
  });
});
