import request from 'supertest';
import express, { Express } from 'express';
import { transactionRoute } from '../../src/routes/transactionRoute';
import * as transactionService from '../../src/service/transactionService';
import * as logger from '../../src/config/logger';
import { expect } from 'chai';
import sinon from 'sinon';

describe('transactionRoute', () => {
    let app: Express;
    let getTransactionByIdStub: sinon.SinonStub;
    let getTransactionsByAccountIdStub: sinon.SinonStub;
    let createTransactionStub: sinon.SinonStub;
    let logInfoStub: sinon.SinonStub;
    let logErrorStub: sinon.SinonStub;

    before(() => {
        app = express();
        app.use(express.json());
        app.use('/transaction', transactionRoute);
    });

    beforeEach(() => {
        getTransactionByIdStub = sinon.stub(transactionService, 'getTransactionById');
        getTransactionsByAccountIdStub = sinon.stub(transactionService, 'getTransactionsByAccountId');
        createTransactionStub = sinon.stub(transactionService, 'createTransaction');
        logInfoStub = sinon.stub(logger, 'logInfo');
        logErrorStub = sinon.stub(logger, 'logError');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /transaction/:transactionId', () => {
        it('should return 400 if transactionId is missing', async () => {
            const res = await request(app).get('/transaction/');
            expect(res.status).to.equal(400);
        });

        it('should return transaction if found', async () => {
            getTransactionByIdStub.resolves({ id: 'tx1', amount: 100 });
            const res = await request(app).get('/transaction/tx1');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ id: 'tx1', amount: 100 });
        });

        it('should return 500 if service throws error', async () => {
            getTransactionByIdStub.rejects(new Error('DB error'));
            const res = await request(app).get('/transaction/tx2');
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('message', 'Internal Server Error');
            expect(logErrorStub.called).to.be.true;
        });
    });

    describe('GET /transaction?accountId=123', () => {
        it('should return 400 if accountId is missing', async () => {
            const res = await request(app).get('/transaction');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('message', 'Account ID is required');
        });

        it('should return transactions for accountId', async () => {
            getTransactionsByAccountIdStub.resolves([{ id: 'tx1' }, { id: 'tx2' }]);
            const res = await request(app).get('/transaction?accountId=123');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([{ id: 'tx1' }, { id: 'tx2' }]);
        });

        it('should return 500 if service throws error', async () => {
            getTransactionsByAccountIdStub.rejects(new Error('DB error'));
            const res = await request(app).get('/transaction?accountId=123');
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('message', 'Internal Server Error');
            expect(logErrorStub.called).to.be.true;
        });
    });

    describe('POST /transaction', () => {
        it('should return 400 if transaction data is missing', async () => {
            const res = await request(app).post('/transaction').send();
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('message', 'Transaction data is required');
        });

        it('should create and return new transaction', async () => {
            const transaction = { amount: 200, accountId: 'acc1' };
            createTransactionStub.resolves({ id: 'tx3', ...transaction });
            const res = await request(app).post('/transaction').send(transaction);
            expect(res.status).to.equal(201);
            expect(res.body).to.deep.equal({ id: 'tx3', ...transaction });
        });

        it('should return 500 if service throws error', async () => {
            createTransactionStub.rejects(new Error('DB error'));
            const res = await request(app).post('/transaction').send({ amount: 100 });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('message', 'Internal Server Error');
            expect(logErrorStub.called).to.be.true;
        });
    });
});