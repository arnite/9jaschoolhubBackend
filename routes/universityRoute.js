import { Router } from 'express';
import * as universityController from '../controllers/universityController.js';

const universityRouter = Router();

universityRouter.post('/', universityController.createUniversity);
universityRouter.get('/', universityController.getAllUniversities);
universityRouter.get('/:id', universityController.getUniversityById);
universityRouter.patch('/:id', universityController.updateUniversity);
universityRouter.delete('/:id', universityController.deleteUniversity);

export default universityRouter;
