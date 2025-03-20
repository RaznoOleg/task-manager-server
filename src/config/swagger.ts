import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks and subtasks',
    },
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title', 'status', 'createdAt'],
          properties: {
            id: { type: 'number', example: '1' },
            title: { type: 'string', example: 'Complete the project' },
            description: {
              type: 'string',
              example: 'Make all final adjustments',
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
            },
            createdAt: {
              type: 'Date',
              example: '2025-03-17T11:19:00.427Z',
            },
            subtasks: {
              type: 'array',
              items: { $ref: '#/components/schemas/Task' },
              example: [],
            },
          },
        },
      },
    },
    paths: {
      '/api/tasks': {
        get: {
          summary: 'Get all tasks',
          tags: ['Tasks'],
          responses: {
            200: {
              description: 'Array of tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new task',
          tags: ['Tasks'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
                example: {
                  title: 'Complete the project',
                  description: 'Make all final adjustments',
                  status: 'in-progress',
                  subtasks: [
                    {
                      title: 'Complete first stage of the project',
                      description: 'Make all final adjustments',
                      status: 'done',
                    },
                    {
                      title: 'Complete second stage of the project',
                      description: 'Make all final adjustments',
                      status: 'todo',
                    },
                  ],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Task created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          summary: 'Get task by ID',
          tags: ['Tasks'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'number' },
              description: 'Task ID',
            },
          ],
          responses: {
            200: {
              description: 'Task details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
            404: { description: 'Task not found' },
          },
        },
        put: {
          summary: 'Update task by ID',
          tags: ['Tasks'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'number' },
              description: 'Task ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
                example: {
                  title: 'Complete the project',
                  description: 'Make all final adjustments',
                  status: 'todo',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Task updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
            404: { description: 'Task not found' },
          },
        },
        delete: {
          summary: 'Delete task',
          tags: ['Tasks'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'number' },
              description: 'Task ID',
            },
          ],
          responses: {
            200: { description: 'Task deleted' },
            404: { description: 'Task not found' },
          },
        },
      },
      '/api/tasks/{id}/subtasks': {
        post: {
          summary: 'Add subtask to a task',
          tags: ['Tasks'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'number' },
              description: 'Parent task ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
                example: {
                  title: 'Complete the project',
                  description: 'Make all final adjustments',
                  status: 'todo',
                  subtasks: [
                    {
                      title: 'Complete the project',
                      description: 'Make all final adjustments',
                      status: 'todo',
                    },
                  ],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Subtask created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
