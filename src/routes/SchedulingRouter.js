import express from 'express';
import {createValidator}  from "express-joi-validation"; 
import SchedulingController from '../controllers/SchedulingController.js';
import {querySchemaCreate, querySchemaUptaded} from '../middleware/schemas/schemasValidate.js';

const schedulingController = new SchedulingController();
const validator = createValidator({passError: true});

const router = express.Router();

router.get('/scheduling', schedulingController.getAll);
router.post('/scheduling',validator.body(querySchemaCreate), schedulingController.store);
router.patch('/scheduling/:id',validator.body(querySchemaUptaded) ,schedulingController.uptadedStatus);

export default router;
