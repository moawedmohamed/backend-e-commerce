import dotenv from 'dotenv'
import express from "express"
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import ProductsRouter from './routers/productRoutes'
import { sql } from './config/db'
import { aj } from './lib/arcJet'
dotenv.config();

const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
// using arcJet rate-limiting to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        })
        if (decision.isDenied()) {
            // res.status(403).json({ error: "Blocked by Shield" });
            if (decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too many requests" })
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot is denied" })
            } else {
                res.status(403).json({ error: "Forbidden" })

            } decision.reason.isShield
            return
        }
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed is denied" })
            return;
        }
        next()
    } catch (error) {
        console.log("arhJet error", error);
        next(error)
    }
})
app.use("/api/products", ProductsRouter)
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