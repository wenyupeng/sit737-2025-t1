const express = require('express');
const { add, subtract, multiply, divide, exponent, sqrt, modulo } = require('../arithmetic/arithmetic.js');
const logger = require('../loggerInit.js');

let router = express.Router();

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

router.post('/exponent', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to raise ${num1} to the power of ${num2}`);
    const result = exponent(num1, num2);
    logger.info(`Result of exponentiation is ${result}`);
    res.json({ result });
});

router.post('/sqrt', (req, res) => {
    const { num1 } = req.body;
    logger.info(`Received request to find the square root of ${num1}`);
    const result = sqrt(num1);
    logger.info(`Result of square root is ${result}`);
    res.json({ result });
});

router.post('/modulo', (req, res) => {
    const { num1, num2 } = req.body;
    logger.info(`Received request to find the remainder of ${num1} divided by ${num2}`);
    const result = modulo(num1, num2);
    logger.info(`Result of modulo is ${result}`);
    res.json({ result });
});

module.exports = router;