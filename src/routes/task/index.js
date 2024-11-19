import express from 'express';

import { assignProject, createTask, deleteTask, getAllTask, getTask, updateTask, updateTaskStatus } from '../../controllers/tasks';
import getTaskOfProjectDueToday from 'controllers/tasks/aggregate';
import getProjectofTaskDueToday from 'controllers/tasks/aggregate';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTask);
router.post('/all', getAllTask);
router.put('/', updateTask);
router.patch('/status', updateTaskStatus)
router.post('/assign-to-project', assignProject)
router.get('/tasks-of-due-projects', getTaskOfProjectDueToday)
router.get('/project-of-due-tasks', getProjectofTaskDueToday)



router.delete('/', deleteTask);



export default router;
