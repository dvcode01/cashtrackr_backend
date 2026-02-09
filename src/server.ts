import express from 'express'; 
import colors from 'colors';
import morgan from 'morgan';

import { db } from './config/db';
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter';

async function connectDB(){
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold('Connection has been established successfully.'));
    } catch (error) {
        console.log(colors.red.bold('Unable to connect to the database'));
    }
}

const app = express();
connectDB();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

export default app