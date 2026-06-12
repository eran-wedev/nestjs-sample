import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Items (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /items returns seed data', () => {
    return request(app.getHttpServer())
      .get('/items')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          completed: expect.any(Boolean),
        });
      });
  });

  it('GET /items?completed=false returns pending items only', () => {
    return request(app.getHttpServer())
      .get('/items?completed=false')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(body.every((item: { completed: boolean }) => !item.completed)).toBe(
          true,
        );
      });
  });

  it('GET /items?q=nestjs finds matching items', () => {
    return request(app.getHttpServer())
      .get('/items?q=nestjs')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(
          body.some((item: { name: string }) =>
            item.name.toLowerCase().includes('nestjs'),
          ),
        ).toBe(true);
      });
  });

  it('POST /items creates an item', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .send({ name: 'E2E task', description: 'Created in test' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'E2E task',
      completed: false,
    });

    await request(app.getHttpServer())
      .get('/items/' + response.body.id)
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe('E2E task');
      });
  });

  it('PATCH /items/:id updates an item', async () => {
    const created = await request(app.getHttpServer())
      .post('/items')
      .send({ name: 'Toggle me' })
      .expect(201);

    await request(app.getHttpServer())
      .patch('/items/' + created.body.id)
      .send({ completed: true })
      .expect(200)
      .expect(({ body }) => {
        expect(body.completed).toBe(true);
      });
  });

  it('DELETE /items/:id removes an item', async () => {
    const created = await request(app.getHttpServer())
      .post('/items')
      .send({ name: 'Delete me' })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/items/' + created.body.id)
      .expect(204);

    await request(app.getHttpServer())
      .get('/items/' + created.body.id)
      .expect(404);
  });

  it('GET /items/stats returns aggregated metrics', () => {
    return request(app.getHttpServer())
      .get('/items/stats')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          total: expect.any(Number),
          completed: expect.any(Number),
          pending: expect.any(Number),
          completionRate: expect.any(Number),
          activity: expect.any(Array),
        });
      });
  });
});
