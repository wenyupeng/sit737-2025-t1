const express = require('express');
const winston = require('winston');
const { add, subtract, multiply, divide } = require('./arithmetic/arithmetic.js');

const app = express();
let router = express.Router()
const port = 3000;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'arithmetic-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log' , level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}


app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    const { num1, num2 } = req.body;
    const n1 = Number(num1);
    const n2 = Number(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: 'Invalid input, both inputs should be numbers' });
    } else {
        req.body.num1 = n1;
        req.body.num2 = n2;
    }
    next();
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

router.post('/add', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to add ${num1} and ${num2}`);
    const result = add(num1, num2);
    logger.info(`Result of addition is ${result}`);
    res.json({ result });
});

router.post('/subtract', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to subtract ${num1} and ${num2}`);
    const result = subtract(num1, num2);
    logger.info(`Result of subtraction is ${result}`);
    res.json({ result });
});

router.post('/multiply', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to multiply ${num1} and ${num2}`);
    const result = multiply(num1, num2);
    logger.info(`Result of multiplication is ${result}`);
    res.json({ result });
});

router.post('/divide', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to divide ${num1} and ${num2}`);
    const result = divide(num1, num2);
    logger.info(`Result of division is ${result}`);
    res.json({ result });
});

app.use('/arithmetic', router);

app.listen(port, () => {
    console.log(`Server running, http://localhost:${port}`);
});