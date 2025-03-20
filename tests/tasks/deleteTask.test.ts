import request from 'supertest';
import app from '../../src/app';
import { TaskStatus } from '../../src/types/taskStatus.enum';
import { Task } from '../../src/models/task.model';
import { AppDataSource } from '../../src/config/data-source';
import { ApiResponse } from '../interfaces/apiResonse';

describe('DELETE /api/tasks/:id', () => {
  let createdTask: Task;

  beforeEach(async () => {
    createdTask = await AppDataSource.getRepository(Task).save({
      title: 'Task to delete',
      description: 'This task will be deleted',
      status: TaskStatus.TODO,
    });
  });

  it('should delete the task successfully', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTask.id}`)
      .expect(200);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.message).toBe('Task deleted successfully');

    const deletedTask = await AppDataSource.getRepository(Task).findOne({
      where: { id: createdTask.id },
    });
    expect(deletedTask).toBeNull();
  });

  it('should return 404 if task does not exist', async () => {
    const nonExistentId = 9999;

    const response = await request(app)
      .delete(`/api/tasks/${nonExistentId}`)
      .expect(404);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe('Task not found');
  });
});
