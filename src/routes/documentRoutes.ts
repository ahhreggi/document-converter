import { Router } from 'express';
import { convertController } from '../controllers';

const router = Router();

router.post('/convert', convertController);

export default router;
