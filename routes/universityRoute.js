import { Router } from 'express';
import * as universityController from '../controllers/universityController.js';
import { API_KEY } from '../controllers/api_keys.js';

const universityRouter = Router();

universityRouter.post('/', API_KEY, universityController.createUniversity);
universityRouter.get('/', universityController.getAllUniversities);
universityRouter.get('/:id', universityController.getUniversityById);
universityRouter.patch('/:id', API_KEY, universityController.updateUniversity);
universityRouter.delete('/:id', API_KEY, universityController.deleteUniversity);

export default universityRouter;
