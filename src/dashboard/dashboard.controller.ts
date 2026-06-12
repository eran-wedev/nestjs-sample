import { Controller, Get, Header } from '@nestjs/common';
import { dashboardPage } from './dashboard.template';

@Controller()
export class DashboardController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDashboard(): string {
    return dashboardPage;
  }
}
