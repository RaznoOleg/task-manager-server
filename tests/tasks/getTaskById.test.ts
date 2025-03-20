import request from 'supertest';
import app from '../../src/app';
import { TaskStatus } from '../../src/types/taskStatus.enum';
import { Task } from '../../src/models/task.model';
import { AppDataSource } from '../../src/config/data-source';
import { ApiResponse } from '../interfaces/apiResonse';

describe('GET /api/tasks/:id', () => {
  let createdTask: Task;

  beforeEach(async () => {
    createdTask = await AppDataSource.getRepository(Task).save({
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
    });
  });

  it('should return a task if it exists', async () => {
    const response = await request(app)
      .get(`/api/tasks/${createdTask.id}`)
      .expect(200);

    const task = response.body as Task;

    expect(task).toHaveProperty('id', createdTask.id);
    expect(task.title).toBe(createdTask.title);
    expect(task.description).toBe(createdTask.description);
    expect(task.status).toBe(createdTask.status);
  });

  it('should return 404 if task does not exist', async () => {
    const nonExistentId = 9999;

    const response = await request(app)
      .get(`/api/tasks/${nonExistentId}`)
      .expect(404);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe('Task not found');
  });
});
