﻿# Task Manager Api

## Overview

Task Manager is a comprehensive task management system where users can create, read, update, and delete (CRUD) tasks and subtasks. The application implements a hierarchical task structure, allowing for the organization of work in a tree-like format with parent tasks and subtasks.

## Technologies Used

### Backend

- **TypeScript** - Strongly typed programming language
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **TypeORM** - Object-Relational Mapping tool with tree entity support
- **Swagger** - API documentation

### Testing

- **Jest** - Testing framework

## Project Structure

```
├──📂 src/
│  ├──📂 config/           # Configuration files (database, server, etc.)
│  ├──📂 controllers/      # Request handlers
│  ├──📂 middlewares/      # Express middlewares
│  ├──📂 models/           # Database entity models
│  ├──📂 routes/           # API route definitions
│  ├──📂 types/            # TypeScript type definitions
│  ├──📂 utils/            # Utility functions
│  │  ├──📂 errors/        # Custom error classes
├──📂 test/
│  ├──📂 interfaces/       # Test interfaces
│  ├──📂 tasks/            # Task-related tests
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000                          # Application port
DB_HOST=your_database_host         # Database host
DB_PORT=your_database_port         # Database port
DB_USER=your_database_user         # Database user
DB_PASS=your_database_password     # Database password
DB_NAME=task-manager               # Database name
```

For testing, create a `.env.test` file with separate database credentials:

```
PORT=5000                          # Application port
DB_HOST=your_database_host         # Database host
DB_PORT=your_database_port         # Database port
DB_USER=your_database_user         # Database user
DB_PASS=your_database_password     # Database password
DB_NAME=task-manager-test          # Database name
```

## Installation and Running the Application

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Steps

### 1. Clone the repository

```bash
git clone https://github.com/RaznoOleg/task-manager-server.git
cd task-manager-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create PostgreSQL databases

```bash
createdb task-manager
createdb task-manager-test  # for testing
```

### 4. Start the application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### 5. Access the application

- API: `http://localhost:<PORT>/api`
- Swagger documentation: `http://localhost:<PORT>/api-docs`

## Testing

Run the test suite with:

```bash
npm test
```

## API Endpoints

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| GET    | /api/tasks              | Get all tasks with their subtasks  |
| GET    | /api/tasks/:id          | Get a task by ID with its subtasks |
| POST   | /api/tasks              | Create a new task                  |
| PUT    | /api/tasks/:id          | Update a task                      |
| DELETE | /api/tasks/:id          | Delete a task and its subtasks     |
| POST   | /api/tasks/:id/subtasks | Add a subtask to a parent task     |

## Example API Requests

### Get All Tasks

```
GET /api/tasks
```

Response:

```json
[
  {
    "id": 1,
    "title": "Project Alpha",
    "description": "Complete Project Alpha by end of month",
    "status": "IN_PROGRESS",
    "createdAt": "2023-09-01T12:00:00Z",
    "subtasks": [
      {
        "id": 2,
        "title": "Design phase",
        "description": "Complete design documentation",
        "status": "DONE",
        "createdAt": "2023-09-01T13:00:00Z",
        "subtasks": []
      },
      {
        "id": 3,
        "title": "Implementation phase",
        "description": "Implement core features",
        "status": "IN_PROGRESS",
        "createdAt": "2023-09-02T10:00:00Z",
        "subtasks": []
      }
    ]
  }
]
```

### Create a Task

```
POST /api/tasks
Content-Type: application/json

{
  "title": "New Project",
  "description": "Start working on the new project",
  "status": "TODO",
  "subtasks": [
    {
      "title": "Research",
      "description": "Research technologies to use",
      "status": "TODO"
    }
  ]
}
```

Response:

```json
{
  "id": 4,
  "title": "New Project",
  "description": "Start working on the new project",
  "status": "TODO",
  "createdAt": "2023-09-03T09:00:00Z",
  "subtasks": [
    {
      "id": 5,
      "title": "Research",
      "description": "Research technologies to use",
      "status": "TODO",
      "createdAt": "2023-09-03T09:00:00Z",
      "subtasks": []
    }
  ]
}
```

### Add a Subtask

```
POST /api/tasks/4/subtasks
Content-Type: application/json

{
  "title": "Development",
  "description": "Start development phase",
  "status": "TODO"
}
```

Response:

```json
{
  "id": 6,
  "title": "Development",
  "description": "Start development phase",
  "status": "TODO",
  "createdAt": "2023-09-03T10:30:00Z",
  "parentTask": {
    "id": 4,
    "title": "New Project",
    "description": "Start working on the new project",
    "status": "TODO",
    "createdAt": "2023-09-03T09:00:00Z"
  },
  "subtasks": []
}
```

### Update a Task

```
PUT /api/tasks/6
Content-Type: application/json

{
  "title": "Development",
  "description": "Development phase in progress",
  "status": "IN_PROGRESS"
}
```

Response:

```json
{
  "id": 6,
  "title": "Development",
  "description": "Development phase in progress",
  "status": "IN_PROGRESS",
  "createdAt": "2023-09-03T10:30:00Z"
}
```

### Delete a Task

```
DELETE /api/tasks/6
```

Response:

```json
{
  "message": "Task deleted successfully"
}
```

## Assumptions & Approach

### Hierarchical Task Structure

- Tasks are organized in a tree structure with parent tasks and subtasks
- Using TypeORM's tree entity pattern with materialized path approach
- Deleting a parent task automatically deletes all subtasks (cascade deletion)

### Task Status Management

- Predefined task statuses: TODO, IN_PROGRESS, DONE
- Status validation on task creation and updates

### Data Validation

- Required fields validation (e.g., title is mandatory)
- Status enum validation to ensure only valid statuses are used

### Error Handling

- Custom error classes for different error types
- Centralized error handling middleware

### Sorting

- Tasks and subtasks are sorted by creation date (newest first)

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, reach out to razno.oleg@gmail.com.
