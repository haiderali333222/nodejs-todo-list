import express from 'express';

import task from './task';
import project from './project';

const router = express.Router();

router.use('/task', task);
router.use('/project', project);

export default router;
