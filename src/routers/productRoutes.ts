import { Request, Response, Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController";

const ProductsRouter = Router()
ProductsRouter.get('/', getProducts)
ProductsRouter.get('/:id', getProductById)
ProductsRouter.post('/', createProduct)
ProductsRouter.put('/:id', updateProduct)
ProductsRouter.delete('/:id', deleteProduct)

export default ProductsRouter

