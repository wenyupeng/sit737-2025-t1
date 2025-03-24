const express = require('express');
const logger = require('./loggerInit.js');
const router = require('./routes/arithmeticRouter.js');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    const { num1, num2 } = req.body;
    const n1 = Number(num1);
    const n2 = Number(num2);
    logger.info(`Request Url: ${req.url}`);
    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: 'Invalid input, both inputs should be numbers' });
    } else {
        req.body.num1 = n1;
        req.body.num2 = n2;
    }
    next();
});

app.use((err, req, res, next) => {
    logger.err(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});


app.use('/arithmetic', router);

app.listen(port, () => {
    console.log(`Server running, http://localhost:${port}`);
});