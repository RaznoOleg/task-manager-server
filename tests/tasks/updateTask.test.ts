import request from 'supertest';
import app from '../../src/app';
import { TaskStatus } from '../../src/types/taskStatus.enum';
import { Task } from '../../src/models/task.model';
import { AppDataSource } from '../../src/config/data-source';
import { ApiResponse } from '../interfaces/apiResonse';

describe('PUT /api/tasks/:id', () => {
  let createdTask: Task;

  beforeEach(async () => {
    createdTask = await AppDataSource.getRepository(Task).save({
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
    });
  });

  it('should update the task status successfully', async () => {
    const updatedStatus = TaskStatus.IN_PROGRESS;

    const response = await request(app)
      .put(`/api/tasks/${createdTask.id}`)
      .send({
        title: 'Test Task',
        description: 'Test description',
        status: updatedStatus,
      })
      .expect(200);

    const updatedTask = response.body as Task;

    expect(updatedTask.id).toBe(createdTask.id);
    expect(updatedTask.status).toBe(updatedStatus);
  });

  it('should return 400 if status is invalid', async () => {
    const invalidStatus = 'INVALID_STATUS';

    const response = await request(app)
      .put(`/api/tasks/${createdTask.id}`)
      .send({
        title: 'Test Task',
        description: 'Test description',
        status: invalidStatus,
      })
      .expect(400);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe(
      `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    );
  });

  it('should return 404 if task does not exist', async () => {
    const nonExistentId = 9999;

    const response = await request(app)
      .put(`/api/tasks/${nonExistentId}`)
      .send({
        title: 'Test Task',
        description: 'Test description',
        status: TaskStatus.DONE,
      })
      .expect(404);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe('Task not found');
  });
});
