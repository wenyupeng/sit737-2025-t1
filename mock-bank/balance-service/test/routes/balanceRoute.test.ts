import request from "supertest";
import express, { Express } from "express";
import { balanceRoute } from "../../src/routes/balanceRoute";
import * as balanceService from "../../src/service/balanceService";
import * as logger from "../../src/config/logger";
import { expect } from "chai";
import sinon from "sinon";

describe("balanceRoute", () => {
    let app: Express;
    let getBalanceStub: sinon.SinonStub;
    let createBalanceStub: sinon.SinonStub;
    let updateBalanceStub: sinon.SinonStub;
    let logInfoStub: sinon.SinonStub;
    let logErrorStub: sinon.SinonStub;

    before(() => {
        app = express();
        app.use(express.json());
        app.use("/balance", balanceRoute);
    });

    beforeEach(() => {
        getBalanceStub = sinon.stub(balanceService, "getBalance");
        createBalanceStub = sinon.stub(balanceService, "createBalance");
        updateBalanceStub = sinon.stub(balanceService, "updateBalance");
        logInfoStub = sinon.stub(logger, "logInfo");
        logErrorStub = sinon.stub(logger, "logError");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("GET /balance", () => {
        it("should return 400 if accountId is missing", async () => {
            const res = await request(app).get("/balance");
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("error", "Account ID is required");
        });

        it("should return 200 and balanceObj if accountId is provided", async () => {
            getBalanceStub.resolves({ accountId: "123", balance: 100 });
            const res = await request(app).get("/balance").query({ accountId: "123" });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("balanceObj");
            expect(res.body.balanceObj).to.deep.equal({ accountId: "123", balance: 100 });
        });

        it("should return 500 if getBalance throws error", async () => {
            getBalanceStub.rejects(new Error("DB error"));
            const res = await request(app).get("/balance").query({ accountId: "123" });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property("error", "DB error");
        });
    });

    describe("POST /balance", () => {
        it("should create a balance and return 201", async () => {
            createBalanceStub.resolves({ accountId: "123", balance: 200 });
            const res = await request(app)
                .post("/balance")
                .send({ accountId: "123", balance: 200 });
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property("balanceObj");
            expect(res.body.balanceObj).to.deep.equal({ accountId: "123", balance: 200 });
        });

        it("should return 500 if createBalance returns null", async () => {
            createBalanceStub.resolves(null);
            const res = await request(app)
                .post("/balance")
                .send({ accountId: "123", balance: 200 });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property("error", "Failed to create balance");
        });

        it("should return 500 if createBalance throws error", async () => {
            createBalanceStub.rejects(new Error("Insert error"));
            const res = await request(app)
                .post("/balance")
                .send({ accountId: "123", balance: 200 });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property("error", "Insert error");
        });
    });

    describe("PUT /balance", () => {
        it("should update a balance and return 200", async () => {
            updateBalanceStub.resolves({ accountId: "123", balance: 300 });
            const res = await request(app)
                .put("/balance")
                .send({ accountId: "123", balance: 300 });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("balanceObj");
            expect(res.body.balanceObj).to.deep.equal({ accountId: "123", balance: 300 });
        });

        it("should return 500 if updateBalance throws error", async () => {
            updateBalanceStub.rejects(new Error("Update error"));
            const res = await request(app)
                .put("/balance")
                .send({ accountId: "123", balance: 300 });
            expect(res.status).to.equal(500);
            expect(res.body).to.have.property("error", "Update error");
        });
    });
});