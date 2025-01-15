import express from 'express';
import { createHouse, deleteHouseById, getAllHouses, getHouseById, deleteHouseById } from '../controllers/HouseController.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, createHouse);
router.get('/', jwtValidation, getAllHouses);
router.get('/:id', jwtValidation, getHouseById);
router.delete('/:id', jwtValidation, deleteHouseById);
export default router;