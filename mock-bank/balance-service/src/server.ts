import express from 'express';
import { balanceRoute, transactionRoute } from './routes'
import connectDB from './config/db';

const app = express();
let port = 3000;

if(process.env.NODE_ENV !== 'production') {
    port = 3001;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/api/balance', balanceRoute);
app.use('/api/transaction', transactionRoute);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});