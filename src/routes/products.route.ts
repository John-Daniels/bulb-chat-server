import express from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware";

const router = express.Router()

// my imports
import { getAllProducts, getProductById, createNewProduct, updateProduct, deleteProductById } from '../controllers/products/products.controller';
const { isDuplicate } = require('../utils/validators')

// TODO: test all
router.get('/', getAllProducts)

// get product by by id
router.get('/:id', getProductById)

// auth middleware here
router.post('/', verifyAuthToken, createNewProduct)

// update by id
router.put('/:id', verifyAuthToken, updateProduct)

// delete by id
router.delete('/:id', verifyAuthToken, deleteProductById)

// crud done

module.exports = router
export default router