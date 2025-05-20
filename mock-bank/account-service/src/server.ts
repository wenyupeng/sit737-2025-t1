import express from 'express';
import {logInfo} from './config/logger';
import connectDB from './config/db';
import { accountRoute } from './routes';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/api/accounts',accountRoute);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});