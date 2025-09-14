import { Request, Response } from "express"

export const getProduct = async(req: Request, res: Response) => {
    res.send('hello from route file');
}
export const createProduct = async(req: Request, res: Response) => {
    res.json({ message: "the product has been create" }).status(201)
}
