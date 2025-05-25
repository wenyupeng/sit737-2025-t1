import { expect } from 'chai';
import sinon from 'sinon';
import * as transactionService from '../../src/service/transactionService';
import Transaction from '../../src/models/Transaction';
import Balance from '../../src/models/Balance';
import * as logger from '../../src/config/logger';

describe('transactionService', () => {
    let findOneStub: sinon.SinonStub;
    let updateOneStub: sinon.SinonStub;
    let saveStub: sinon.SinonStub;
    let findStub: sinon.SinonStub;
    let updateTransactionStub: sinon.SinonStub;
    let logInfoStub: sinon.SinonStub;
    let logErrorStub: sinon.SinonStub;

    const fakeFromAccount = { accountId: 'acc1', balance: 1000 };
    const fakeToAccount = { accountId: 'acc2', balance: 500 };
    const fakeTransaction = {
        transactionType: 'deposit',
        transactionAmount: 100,
        transactionDate: new Date(),
        fromAccountId: 'acc1',
        toAccountId: 'acc2'
    };

    beforeEach(() => {
        findOneStub = sinon.stub(Balance, 'findOne');
        updateOneStub = sinon.stub(Balance, 'updateOne');
        saveStub = sinon.stub(Transaction.prototype, 'save');
        findStub = sinon.stub(Transaction, 'find');
        updateTransactionStub = sinon.stub(Transaction, 'updateOne');
        logInfoStub = sinon.stub(logger, 'logInfo');
        logErrorStub = sinon.stub(logger, 'logError');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createTransaction', () => {
        it('should create a deposit transaction and update balance', async () => {
            findOneStub.resolves(fakeFromAccount);
            saveStub.resolves();
            updateOneStub.resolves();
            updateTransactionStub.resolves();

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'deposit'
            });

            expect(result).to.be.an('object');
            expect(saveStub.calledOnce).to.be.true;
            expect(updateOneStub.calledOnce).to.be.true;
            expect(updateTransactionStub.calledOnce).to.be.true;
        });

        it('should create a withdraw transaction and update balance', async () => {
            findOneStub.resolves(fakeFromAccount);
            saveStub.resolves();
            updateOneStub.resolves();
            updateTransactionStub.resolves();

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'withdraw'
            });

            expect(result).to.be.an('object');
            expect(saveStub.calledOnce).to.be.true;
            expect(updateOneStub.calledOnce).to.be.true;
        });

        it('should create a transfer transaction and update both balances', async () => {
            findOneStub.onFirstCall().resolves(fakeFromAccount);
            findOneStub.onSecondCall().resolves(fakeToAccount);
            saveStub.resolves();
            updateOneStub.resolves();
            updateTransactionStub.resolves();

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'transfer'
            });

            expect(result).to.be.an('object');
            expect(saveStub.calledOnce).to.be.true;
            expect(updateOneStub.callCount).to.equal(2); // from and to accounts updated
        });

        it('should return null if fromAccount not found', async () => {
            findOneStub.resolves(null);

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'deposit'
            });

            expect(result).to.be.null;
            expect(logInfoStub.called).to.be.true;
        });

        it('should return null if toAccount not found for transfer', async () => {
            findOneStub.onFirstCall().resolves(fakeFromAccount);
            findOneStub.onSecondCall().resolves(null);

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'transfer'
            });

            expect(result).to.be.null;
            expect(logInfoStub.called).to.be.true;
        });

        it('should return null and log error if save throws', async () => {
            findOneStub.resolves(fakeFromAccount);
            saveStub.rejects(new Error('DB error'));

            const result = await transactionService.createTransaction({
                ...fakeTransaction,
                transactionType: 'deposit'
            });

            expect(result).to.be.null;
            expect(logErrorStub.called).to.be.true;
        });
    });

    describe('getTransactionsByAccountId', () => {
        it('should return transactions for an account', async () => {
            const fakeTransactions = [{}, {}];
            findStub.returns({ sort: sinon.stub().returns(fakeTransactions) });

            const result = await transactionService.getTransactionsByAccountId('acc1');
            expect(result).to.equal(fakeTransactions);
        });
    });

    describe('getTransactionById', () => {
        it('should return a transaction by id', async () => {
            const fakeTx = { transactionId: 'tx1' };
            const findOneTxStub = sinon.stub(Transaction, 'findOne').resolves(fakeTx);

            const result = await transactionService.getTransactionById('tx1');
            expect(result).to.equal(fakeTx);

            findOneTxStub.restore();
        });
    });
});