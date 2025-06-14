import { searchByUniversity } from '../controllers/searchController.js';
import { Router } from 'express';
const router = Router();

router.route('/searchUniversity').get(searchByUniversity);
export default router;
