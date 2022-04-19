import express from 'express';
import SchedulingController from '../controllers/SchedulingController.js';

const schedulingController = new SchedulingController();

const router = express.Router();

router.get('/scheduling', schedulingController.getAll);
router.post('/scheduling', schedulingController.store);
router.patch('/scheduling/:id', schedulingController.uptadedStatus);

export default router;
