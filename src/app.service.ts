export class AppService {
  getHello() {
    return {
      message: 'Welcome to the NestJS sample API',
      endpoints: {
        dashboard: 'GET /',
        health: 'GET /api',
        items: {
          list: 'GET /items?completed=&q=',
          stats: 'GET /items/stats',
          get: 'GET /items/:id',
          create: 'POST /items',
          update: 'PATCH /items/:id',
          delete: 'DELETE /items/:id',
        },
      },
    };
  }
}
