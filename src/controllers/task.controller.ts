import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Task } from '../models/task.model';
import { BadRequestError, NotFoundError } from '../utils/errors/httpError';
import { TaskStatus } from '../types/taskStatus.enum';

const taskRepository = AppDataSource.getTreeRepository(Task);

const validateTaskData = (taskData: Task) => {
  if (!taskData.title) {
    throw new BadRequestError('Title is required');
  }
  if (!Object.values(TaskStatus).includes(taskData.status)) {
    throw new BadRequestError(
      `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    );
  }
};

const validateAllTasks = (taskData: Task) => {
  validateTaskData(taskData);

  if (taskData.subtasks?.length) {
    taskData.subtasks.forEach((subtask) => validateAllTasks(subtask));
  }
};

const findTaskByIdOrFail = async (id: string | number) => {
  const task = await taskRepository.findOne({ where: { id: Number(id) } });
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await taskRepository.findTrees();

    const sortTasksRecursively = (tasks: Task[]): Task[] => {
      return tasks
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((task) => ({
          ...task,
          subtasks: task.subtasks ? sortTasksRecursively(task.subtasks) : [],
        }));
    };

    const sortedTasks = sortTasksRecursively(tasks);

    res.json(sortedTasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await findTaskByIdOrFail(req.params.id);
    const taskWithSubtasks = await taskRepository.findDescendantsTree(task);

    taskWithSubtasks.subtasks = taskWithSubtasks.subtasks?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json(taskWithSubtasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request<object, object, Task>,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateTaskData(req.body);

    const newTask = await createTaskWithSubtasks(req.body, req.body.parentTask);
    res.status(201).json(await taskRepository.findDescendantsTree(newTask));
  } catch (error) {
    next(error);
  }
};

const createTaskWithSubtasks = async (taskData: Task, parent?: Task) => {
  validateAllTasks(taskData);

  const task = taskRepository.create({
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
    parentTask: parent,
  });

  await taskRepository.save(task);

  if (taskData.subtasks?.length) {
    await Promise.all(
      taskData.subtasks.map((subtask) => createTaskWithSubtasks(subtask, task)),
    );
  }

  return task;
};

export const updateTask = async (
  req: Request<{ id: string }, object, Task>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await findTaskByIdOrFail(req.params.id);
    validateTaskData(req.body);

    Object.assign(task, req.body);
    res.json(await taskRepository.save(task));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await findTaskByIdOrFail(req.params.id);
    await taskRepository.remove(task);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (
  req: Request<{ id: string }, object, Task>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parentTask = await findTaskByIdOrFail(req.params.id);
    validateTaskData(req.body);

    const newTask = await createTaskWithSubtasks(req.body, parentTask);
    res.status(201).json(await taskRepository.findDescendantsTree(newTask));
  } catch (error) {
    next(error);
  }
};
