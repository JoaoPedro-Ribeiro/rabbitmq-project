import { Router } from 'express';
import StatusController from '../controllers/StatusController';
const router = Router();

router.get('/pendings', StatusController.pendings)

export default router;