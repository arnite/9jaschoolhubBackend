import { searchByProgramme } from '../controllers/searchController.js';
import { Router } from 'express';

const searchRouter = Router();
searchRouter.route('/').get(searchByProgramme);

export default searchRouter;
