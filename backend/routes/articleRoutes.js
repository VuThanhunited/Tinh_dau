import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getArticles)
  .post(protect, admin, createArticle);

router.route('/:idOrSlug')
  .get(getArticleById);

router.route('/:id')
  .put(protect, admin, updateArticle)
  .delete(protect, admin, deleteArticle);


export default router;
