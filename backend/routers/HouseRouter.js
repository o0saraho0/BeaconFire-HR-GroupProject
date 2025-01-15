import express from 'express';
import { createHouse, getAllHouses, getHouseById } from '../controllers/HouseController.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, createHouse);
router.get('/', jwtValidation, getAllHouses);
router.get('/:id', jwtValidation, getHouseById);

export default router;