import express from 'express';

import { createProject, deleteProject, getAllProject, getProject, updateProject } from '../../controllers/project';

const router = express.Router();

router.post('/', createProject);
router.get('/', getProject);
router.post('/all', getAllProject);
router.put('/', updateProject);
router.delete('/', deleteProject);


export default router;
