import { Request, Response, Router } from "express";
import { createProduct, getProduct } from "../controllers/productController";

const ProductsRouter = Router()
ProductsRouter.get('/test', getProduct)
ProductsRouter.post('/post', createProduct)
export default ProductsRouter

