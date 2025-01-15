import express from 'express';
import { createHouse, getAllHouses, getHouseById, deleteHouseById } from '../controllers/HouseController.js';
import { jwtValidation, authenticatedHR } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, authenticatedHR, createHouse);
router.get('/', jwtValidation, authenticatedHR, getAllHouses);
router.get('/:id', jwtValidation, authenticatedHR, getHouseById);
router.delete('/:id', jwtValidation, authenticatedHR, deleteHouseById);
export default router;