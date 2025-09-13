import dotenv from 'dotenv'
import express from "express"
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
dotenv.config();

const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.json("hello")
});
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('This app ruining on port', PORT);

})