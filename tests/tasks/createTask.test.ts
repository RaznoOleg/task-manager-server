import request from 'supertest';
import app from '../../src/app';
import { TaskStatus } from '../../src/types/taskStatus.enum';
import { Task } from '../../src/models/task.model';
import { ApiResponse } from '../interfaces/apiResonse';

describe('POST /api/tasks', () => {
  it('should create a task with valid data', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Task description',
      status: TaskStatus.TODO,
      subtasks: [],
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(201);

    const task = response.body as Task;

    expect(task).toHaveProperty('id');
    expect(task.title).toBe(taskData.title);
    expect(task.status).toBe(taskData.status);
    expect(task.subtasks).toEqual([]);
  });

  it('should return 400 if title is missing', async () => {
    const taskData = {
      description: 'Task description',
      status: TaskStatus.TODO,
    };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(400);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe('Title is required');
  });
});
