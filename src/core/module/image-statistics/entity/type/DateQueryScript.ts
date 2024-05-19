import { Image } from '@core/module/image/entity/Image';
import { SQL, sql } from 'drizzle-orm';
import { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

export class DateQueryScript {
  getDay: SQL<string>;
  comparesLessDay: SQL<string>;
  compareGreaterDay: SQL<string>;
  constructor(type: string, table: any, start_day: Date, end_day: Date) {
    switch (type) {
      case 'WEEK':
        this.getDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%u')`;
        this.comparesLessDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%u') >= DATE_FORMAT(${start_day}, '%Y-%u')`;
        this.compareGreaterDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%u') <= DATE_FORMAT(${end_day}, '%Y-%u')`;
        break;
      case 'MONTH':
        this.getDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%m')`;
        this.comparesLessDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%m') >= DATE_FORMAT(${start_day}, '%Y-%m')`;
        this.compareGreaterDay = sql`DATE_FORMAT(${table.createdAt}, '%Y-%m') <= DATE_FORMAT(${end_day}, '%Y-%m')`;
        break;
      case 'YEAR':
        this.getDay = sql`DATE_FORMAT(${table.createdAt}, '%Y')`;
        this.comparesLessDay = sql`DATE_FORMAT(${table.createdAt}, '%Y') >= DATE_FORMAT(${start_day}, '%Y')`;
        this.compareGreaterDay = sql`DATE_FORMAT(${table.createdAt}, '%Y') <= DATE_FORMAT(${end_day}, '%Y')`;
        break;
      default:
        this.getDay = sql`DATE(${table.createdAt})`;
        this.comparesLessDay = sql`DATE(${table.createdAt}) >= ${start_day}`;
        this.compareGreaterDay = sql`DATE(${table.createdAt}) <= ${end_day}`;
        break;
    }
  }
}
