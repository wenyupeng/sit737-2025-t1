import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import { accountRoute } from '../../src/routes/accountRoute';
import Account from '../../src/models/Account';

describe('accountRoute', () => {
    let app: express.Express;
    let findStub: sinon.SinonStub;
    let saveStub: sinon.SinonStub;
    let deleteOneStub: sinon.SinonStub;
    let fetchStub: sinon.SinonStub;

    before(() => {
        app = express();
        app.use(express.json());
        app.use('/api/account', accountRoute);
    });

    beforeEach(() => {
        findStub = sinon.stub(Account, 'find');
        saveStub = sinon.stub(Account.prototype, 'save');
        deleteOneStub = sinon.stub(Account, 'deleteOne');
        fetchStub = sinon.stub(global, 'fetch' as any);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/account/:accountId', () => {
        it('should return 400 if accountId is missing', async () => {
            const res = await request(app).get('/api/account/');
            expect(res.status).to.equal(404); // Express will not match this route, so 404
        });

        it('should return 404 if account not found', async () => {
            findStub.resolves(null);
            const res = await request(app).get('/api/account/123');
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Account not found');
        });

        it('should return 200 and account if found', async () => {
            const fakeAccount = [{ accountId: '123', accountType: 'savings' }];
            findStub.resolves(fakeAccount);
            const res = await request(app).get('/api/account/123');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(fakeAccount);
        });

        it('should return 500 on error', async () => {
            findStub.rejects(new Error('DB error'));
            const res = await request(app).get('/api/account/123');
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal('Internal server error');
        });
    });

    describe('POST /api/account', () => {
        it('should return 400 if accountId or accountType missing', async () => {
            const res = await request(app).post('/api/account').send({ accountType: 'savings' });
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Account number and account type are required');
        });

        it('should create account and balance successfully', async () => {
            saveStub.resolves();
            fetchStub.resolves({
                ok: true,
                json: async () => ({ balance: 100 }),
            });
            const res = await request(app)
                .post('/api/account')
                .send({ accountId: '123', accountType: 'savings', balance: 100 });
            expect(res.status).to.equal(201);
            expect(res.body.accountId).to.equal('123');
        });

        it('should rollback and return 500 if balance creation fails', async () => {
            saveStub.resolves();
            fetchStub.resolves({ ok: false });
            deleteOneStub.resolves();
            const res = await request(app)
                .post('/api/account')
                .send({ accountId: '123', accountType: 'savings', balance: 100 });
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal('Failed to create balance, account rolled back');
        });

        it('should rollback and return 500 if balance response is invalid', async () => {
            saveStub.resolves();
            fetchStub.resolves({
                ok: true,
                json: async () => null,
            });
            deleteOneStub.resolves();
            const res = await request(app)
                .post('/api/account')
                .send({ accountId: '123', accountType: 'savings', balance: 100 });
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal('Balance response invalid, account rolled back');
        });

        it('should rollback and return 500 on unexpected error', async () => {
            saveStub.resolves();
            fetchStub.rejects(new Error('Network error'));
            deleteOneStub.resolves();
            const res = await request(app)
                .post('/api/account')
                .send({ accountId: '123', accountType: 'savings', balance: 100 });
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal('Internal server error with rollback');
        });
    });
});