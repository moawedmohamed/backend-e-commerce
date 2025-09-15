import { Request, Response } from "express"
import { sql } from "../config/db";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await sql`
        select * from products order By created_at DESC
        `
        console.log('fetched products', products);
        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "internal server error " })

    }
}

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, image } = req.body
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All filed are required " })
    }
    try {
        const newProduct = await sql`
        insert into products (name,price,image)values (${name},${price},${image})
        returning *
        `
        return res.status(200).json({ success: true, data: newProduct[0] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "internal server error " })
    }

}
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await sql`
        select * from products where id = ${id}
        `
        res.status(200).json({ success: true, message: product[0] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "internal server error " })

    }
}
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, price, image } = req.body
    try {
        const updatedProduct = await sql`
        update products set name=${name},price=${price},image=${image} 
        where id=${id} returning *
        `
        if (updatedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        return res.status(200).json({ success: true, message: updatedProduct[0] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "internal server error " })

    }
}
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const removedProduct = await sql`
        DELETE FROM products
        WHERE id=${id} returning *
        `
        if (removedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        return res.status(200).json({ success: true, data: removedProduct[0] })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "internal server error " })

    }
}

