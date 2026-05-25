import express from 'express';
import { getSettingByKey, updateSettingByKey } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:key')
  .get(getSettingByKey)
  .put(protect, admin, updateSettingByKey);

export default router;
