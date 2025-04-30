const express = require('express');
const { connectDB } = require('./routers/dbConnection.js');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/api', require('./routers/router'));

async function startServer() {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

startServer();
