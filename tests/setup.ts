import { AppDataSource } from '../src/config/data-source';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const entities = AppDataSource.manager.connection.entityMetadatas;
  for (const entity of entities) {
    await AppDataSource.getRepository(entity.name).clear();
  }
});
