import express from 'express';
import { createHouse, getAllHouses, getHouseById } from '../controllers/HouseController.js';
import authenticateUser from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createHouse);
router.get('/', authenticateUser, getAllHouses);
router.get('/:id', authenticateUser, getHouseById);

export default router;