import { expect } from 'chai';
import sinon from 'sinon';
import * as balanceService from '../../src/service/balanceService';
import Balance from '../../src/models/Balance';
import * as logger from '../../src/config/logger';

describe('balanceService', () => {
    let findOneStub: sinon.SinonStub;
    let findOneAndUpdateStub: sinon.SinonStub;
    let saveStub: sinon.SinonStub;
    let logInfoStub: sinon.SinonStub;
    let logErrorStub: sinon.SinonStub;

    beforeEach(() => {
        findOneStub = sinon.stub(Balance, 'findOne');
        findOneAndUpdateStub = sinon.stub(Balance, 'findOneAndUpdate');
        saveStub = sinon.stub(Balance.prototype, 'save');
        logInfoStub = sinon.stub(logger, 'logInfo');
        logErrorStub = sinon.stub(logger, 'logError');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getBalance', () => {
        it('should return balance if found', async () => {
            const mockBalance = { accountId: '123', balance: 100 };
            findOneStub.resolves(mockBalance);

            const result = await balanceService.getBalance('123');
            expect(result).to.equal(mockBalance);
            expect(logInfoStub.calledWith('Balance for account 123 found')).to.be.true;
        });

        it('should return null if balance not found', async () => {
            findOneStub.resolves(null);

            const result = await balanceService.getBalance('999');
            expect(result).to.be.null;
            expect(logErrorStub.calledWith('Balance for account 999 not found')).to.be.true;
        });

        it('should handle errors and return null', async () => {
            findOneStub.rejects(new Error('DB error'));

            const result = await balanceService.getBalance('err');
            expect(result).to.be.null;
            expect(logErrorStub.called).to.be.true;
        });
    });

    describe('updateBalance', () => {
        it('should update and return the balance', async () => {
            const mockUpdated = { accountId: '123', balance: 200 };
            findOneAndUpdateStub.resolves(mockUpdated);

            const result = await balanceService.updateBalance('123', 200, new Date());
            expect(result).to.equal(mockUpdated);
            expect(logInfoStub.calledWith('Balance for account 123 updated')).to.be.true;
        });

        it('should return null if update fails', async () => {
            findOneAndUpdateStub.resolves(null);

            const result = await balanceService.updateBalance('123', 200, new Date());
            expect(result).to.be.null;
            expect(logErrorStub.calledWith('Error updating balance for account 123')).to.be.true;
        });

        it('should handle errors and return null', async () => {
            findOneAndUpdateStub.rejects(new Error('Update error'));

            const result = await balanceService.updateBalance('123', 200, new Date());
            expect(result).to.be.null;
            expect(logErrorStub.called).to.be.true;
        });
    });

    describe('createBalance', () => {
        it('should create and return the new balance', async () => {
            const mockSaved = { accountId: '123', balance: 300 };
            saveStub.resolves(mockSaved);

            const result = await balanceService.createBalance('123', 300, new Date());
            expect(result).to.equal(mockSaved);
            expect(logInfoStub.calledWith('Balance for account 123 created')).to.be.true;
        });

        it('should return null if save fails', async () => {
            saveStub.resolves(null);

            const result = await balanceService.createBalance('123', 300, new Date());
            expect(result).to.be.null;
            expect(logErrorStub.calledWith('Error creating balance for account 123')).to.be.true;
        });

        it('should handle errors and return null', async () => {
            saveStub.rejects(new Error('Save error'));

            const result = await balanceService.createBalance('123', 300, new Date());
            expect(result).to.be.null;
            expect(logErrorStub.called).to.be.true;
        });
    });
});