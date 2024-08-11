import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {
    createTestBook, createTestBookMany,
    createTestMember, createTestMemberMany,
    createTestTransaction, createTestTransactionMany,
    removeTestBook,
    removeTestMember,
    removeTestTransaction
} from "./test-util.js";

describe('POST /api/borrow', function () {
    afterEach(async () => {
        await removeTestTransaction();
        await removeTestMember();
        await removeTestBook();
    })

    beforeEach(async () => {
        await createTestMember();
        await createTestBook();
    })

    it('should can borrow a book', async () => {
        const result = await supertest(web)
            .post('/api/borrow')
            .send({
                memberCode: "test",
                bookCode: "test",
                borrowedDate: "01-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(201);
        expect(result.body.data.member.code).toBe("test");
        expect(result.body.data.member.name).toBe("test");
        expect(result.body.data.book.code).toBe("test");
        expect(result.body.data.book.title).toBe("test");
        expect(result.body.data.book.author).toBe("test");
        expect(new Date(result.body.data.borrowedDate)).toBeInstanceOf(Date);
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/borrow')
            .send({
                memberCode: "",
                bookCode: "",
                borrowedDate: ""
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if member not found', async () => {
        const result = await supertest(web)
            .post('/api/borrow')
            .send({
                memberCode: "salah",
                bookCode: "test",
                borrowedDate: "01-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if book not found', async () => {
        const result = await supertest(web)
            .post('/api/borrow')
            .send({
                memberCode: "test",
                bookCode: "book",
                borrowedDate: "01-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if member is currently penalized', async () => {
        const result = await supertest(web)
            .post('/api/borrow')
            .send({
                memberCode: "test",
                bookCode: "book",
                borrowedDate: "01-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/borrow', function () {
    afterEach(async () => {
        await removeTestTransaction();
        await removeTestMember();
        await removeTestBook();
    })

    beforeEach(async () => {
        await createTestMemberMany();
        await createTestBookMany();
        await createTestTransactionMany();
    })

    it('should can get all transactions', async () => {
        const result = await supertest(web)
            .get('/api/borrow');

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
    });
});

describe('POST /api/return', function () {
    afterEach(async () => {
        await removeTestMember();
        await removeTestBook();
    })

    beforeEach(async () => {
        await createTestMember();
        await createTestBook();
        await createTestTransaction();
    })

    it('should can return a book', async () => {
        const result = await supertest(web)
            .post('/api/return')
            .send({
                memberCode: "test",
                bookCode: "test",
                returnedDate: "08-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Book returned successfully");
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/return')
            .send({
                memberCode: "",
                bookCode: "",
                returnedDate: ""
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if member not found', async () => {
        const result = await supertest(web)
            .post('/api/return')
            .send({
                memberCode: "salah",
                bookCode: "test",
                returnedDate: "08-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if book not found', async () => {
        const result = await supertest(web)
            .post('/api/return')
            .send({
                memberCode: "test",
                bookCode: "salah",
                returnedDate: "01-01-2024"
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if transaction not found', async () => {
        const result = await supertest(web)
            .post('/api/return')
            .send({
                memberCode: "test",
                bookCode: "test",
                returnedDate: null
            });

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});