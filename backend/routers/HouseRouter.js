import express from 'express';
import { createHouse, getAllHouses, getHouseById, deleteHouseById, getHouseByUserId } from '../controllers/HouseController.js';
import { jwtValidation, authenticatedHR, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, authenticatedHR, createHouse);
router.get('/', jwtValidation, authenticatedHR, getAllHouses);
router.get('/by-user', jwtValidation, getHouseByUserId); // For employees to see their assigned house
router.get('/:id', jwtValidation, authenticatedHR, getHouseById); // For HR to search by house _id
router.delete('/:id', jwtValidation, authenticatedHR, deleteHouseById); 
export default router;