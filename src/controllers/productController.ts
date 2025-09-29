import { Request, Response } from "express";
import { sql } from "../config/db";

// 🟢 Get all products
export const getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;
        console.log("fetched products", products);
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

// 🟢 Create new product
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;
        return res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

// 🟢 Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

// 🟢 Update product
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;
        if (updatedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

// 🟢 Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const removedProduct = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `;
        if (removedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: removedProduct[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};
