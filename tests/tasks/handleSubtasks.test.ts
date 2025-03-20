import request from 'supertest';
import app from '../../src/app';
import { TaskStatus } from '../../src/types/taskStatus.enum';
import { Task } from '../../src/models/task.model';
import { AppDataSource } from '../../src/config/data-source';
import { ApiResponse } from '../interfaces/apiResonse';

describe('POST /api/tasks/:id/subtasks', () => {
  let parentTask: Task;
  let subtask1: Task;
  let subtask2: Task;
  let subtask3: Task;

  beforeEach(async () => {
    parentTask = await AppDataSource.getRepository(Task).save({
      title: 'Parent Task',
      description: 'This is the parent task',
      status: TaskStatus.TODO,
    });

    subtask1 = await AppDataSource.getRepository(Task).save({
      title: 'Subtask 1',
      description: 'This is the first subtask',
      status: TaskStatus.TODO,
      parentTask,
    });

    subtask2 = await AppDataSource.getRepository(Task).save({
      title: 'Subtask 2',
      description: 'This is the second subtask',
      status: TaskStatus.TODO,
      parentTask,
    });

    subtask3 = await AppDataSource.getRepository(Task).save({
      title: 'Subtask 3',
      description: 'This is a nested subtask inside subtask2',
      status: TaskStatus.TODO,
      parentTask: subtask2,
    });
  });

  it('should create a task with two subtasks', async () => {
    const response = await request(app)
      .get(`/api/tasks/${parentTask.id}`)
      .expect(200);

    const task = response.body as Task;

    expect(task.id).toBe(parentTask.id);
    expect(task.subtasks).toHaveLength(2);
    expect(task.subtasks?.[0].subtasks?.[0].title).toBe(subtask3.title);
    expect(task.subtasks?.[0].title).toBe(subtask2.title);
    expect(task.subtasks?.[1].title).toBe(subtask1.title);
  });

  it('should add a new subtask to an existing task', async () => {
    const newSubtask = {
      title: 'New Subtask',
      description: 'This is a newly added subtask',
      status: TaskStatus.TODO,
    };

    await request(app)
      .post(`/api/tasks/${parentTask.id}/subtasks`)
      .send(newSubtask)
      .expect(201);

    const updatedTask = await request(app)
      .get(`/api/tasks/${parentTask.id}`)
      .expect(200);

    const task = updatedTask.body as Task;

    expect(task.subtasks).toHaveLength(3);
    expect(task.subtasks?.[0].title).toBe(newSubtask.title);
  });

  it('should return 404 when adding a subtask to a non-existent task', async () => {
    const nonExistentId = 9999;

    const response = await request(app)
      .post(`/api/tasks/${nonExistentId}/subtasks`)
      .send({
        title: 'Invalid Subtask',
        description: 'This task should not be created',
        status: TaskStatus.TODO,
      })
      .expect(404);

    const responseBody = response.body as ApiResponse;

    expect(responseBody.error).toBe('Task not found');
  });
});
