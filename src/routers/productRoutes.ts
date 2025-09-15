import { Request, Response, Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController";

const ProductsRouter = Router()
ProductsRouter.get('/', getProducts)
ProductsRouter.get('/:id', getProductById)
ProductsRouter.post('/post', createProduct)
ProductsRouter.get('/:id', updateProduct)
ProductsRouter.get('/:id', deleteProduct)

export default ProductsRouter

