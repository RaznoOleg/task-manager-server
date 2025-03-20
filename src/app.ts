import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(cors());
app.use(json());

setupSwagger(app);

app.use('/api', taskRoutes);

app.use(errorHandler);

export default app;
