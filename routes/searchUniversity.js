import { searchByUniversity } from '../controllers/searchController.js';
import { Router } from 'express';
const router = Router();

router.route('/').get(searchByUniversity);
export default router;
