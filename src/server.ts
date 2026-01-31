import express from 'express'; 
import colors from 'colors';
import morgan from 'morgan';

import { db } from './config/db';

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

export default app