import { DataSourceOptions } from 'typeorm';

export const testDbConfig: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
};
