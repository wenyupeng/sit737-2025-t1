import { expect } from 'chai';
import sinon from 'sinon';
import * as accountService from '../../src/service/accountService';
import Account from '../../src/models/Account';
import * as logger from '../../src/config/logger';

describe('accountService', () => {
    let logInfoStub: sinon.SinonStub;
    let logErrorStub: sinon.SinonStub;

    beforeEach(() => {
        logInfoStub = sinon.stub(logger, 'logInfo');
        logErrorStub = sinon.stub(logger, 'logError');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createAccount', () => {
        it('should create a new account and return it', async () => {
            const saveStub = sinon.stub().resolves();
            const fakeAccount = {
                accountId: '123',
                accountType: 'savings',
                createdAt: new Date(),
                updatedAt: new Date(),
                save: saveStub
            };
            const accountConstructorStub = sinon.stub(Account.prototype, 'constructor').returns(fakeAccount);
            sinon.stub(Account.prototype, 'save').resolves(fakeAccount);

            // Use sinon.stub to replace Account with a constructor that returns fakeAccount
            const AccountStub = sinon.stub().returns(fakeAccount);
            Object.setPrototypeOf(AccountStub, Account);

            // Replace Account with our stub for this test
            const originalAccount = (accountService as any).__proto__.Account;
            (accountService as any).__proto__.Account = AccountStub;

            const params = { accountId: '123', accountType: 'savings' };
            const result = await accountService.createAccount(params);

            expect(result.accountId).to.equal('123');
            expect(logInfoStub.called).to.be.true;
            expect(saveStub.called).to.be.false;

            // Restore Account
            (accountService as any).__proto__.Account = originalAccount;
        });

        it('should log and throw error if account creation fails', async () => {
            const error = new Error('DB error');
            sinon.stub(Account.prototype, 'save').rejects(error);

            const params = { accountId: '456', accountType: 'current' };
            try {
                await accountService.createAccount(params);
                expect.fail('Expected error to be thrown');
            } catch (err: any) {
                expect(logErrorStub.calledWithMatch(/Error creating account/)).to.be.true;
                expect(err.message).to.equal('DB error');
            }
        });
    });

    describe('getAccount', () => {
        it('should return account if found', async () => {
            const fakeAccount = { accountId: '789', accountType: 'savings' };
            sinon.stub(Account, 'findOne').resolves(fakeAccount as any);

            const result = await accountService.getAccount('789');
            expect(result).to.equal(fakeAccount);
            expect(logInfoStub.calledWithMatch(/Getting account/)).to.be.true;
        });

        it('should log and throw error if account not found', async () => {
            sinon.stub(Account, 'findOne').resolves(null);

            try {
                await accountService.getAccount('000');
                expect.fail('Expected error to be thrown');
            } catch (err: any) {
                expect(logErrorStub.calledWithMatch(/not found/)).to.be.true;
                expect(err.message).to.match(/not found/);
            }
        });

        it('should log and throw error if findOne throws', async () => {
            const error = new Error('DB error');
            sinon.stub(Account, 'findOne').rejects(error);

            try {
                await accountService.getAccount('111');
                expect.fail('Expected error to be thrown');
            } catch (err: any) {
                expect(logErrorStub.calledWithMatch(/Error getting account/)).to.be.true;
                expect(err.message).to.equal('DB error');
            }
        });
    });
});