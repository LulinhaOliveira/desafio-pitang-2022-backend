import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import SchedulingRouter from '../routes/SchedulingRouter.js';
import { errorJSON } from '../middleware/schemas/schemasValidate.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(SchedulingRouter);
app.use(errorJSON)
export  {app};
