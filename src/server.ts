import dotenv from 'dotenv'
import express from "express"
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import ProductsRouter from './routers/productRoutes'
import { sql } from './config/db'
dotenv.config();

const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use("/api/products", ProductsRouter)
app.get('/', (req, res) => {
    res.json("hello")
});
const PORT = process.env.PORT
const initialDB = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) 
        `
    } catch (error) {
        console.log(error);
    }
}
initialDB().then(() => {
    app.listen(PORT, () => {
        console.log('This app ruining on port', PORT);
    })
})