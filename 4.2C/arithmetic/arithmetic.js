function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function exponent(a, b) {
    return Math.pow(a, b);
}

function sqrt(a) {
    return Math.sqrt(a);
}

function modulo(a, b) {
    return a % b;
}

module.exports = {
    add,
    subtract,
    multiply,
    divide,
    exponent,
    sqrt,
    modulo
};