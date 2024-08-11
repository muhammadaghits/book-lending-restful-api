import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestBook, createTestBookMany, getTestBook, removeTestBook} from "./test-util.js";

describe('POST /api/books', function () {
    afterEach(async () => {
        await removeTestBook();
    })

    it('should can create a new book', async () => {
        const result = await supertest(web)
            .post('/api/books')
            .send({
                code: "test",
                title: "test",
                author: "test",
                stock: true
            });

        logger.info(result.body);
        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe("test");
        expect(result.body.data.title).toBe("test");
        expect(result.body.data.author).toBe("test");
        expect(result.body.data.stock).toBe(true);
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/books')
            .send({
                code: "",
                title: "",
                author: "",
                stock: ""
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if book code already exist', async () => {
        let result = await supertest(web)
            .post('/api/books')
            .send({
                code: "test",
                title: "test",
                author: "test",
                stock: true
            });

        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe("test");
        expect(result.body.data.title).toBe("test");
        expect(result.body.data.author).toBe("test");
        expect(result.body.data.stock).toBe(true);

        result = await supertest(web)
            .post('/api/books')
            .send({
                code: "test",
                title: "test",
                author: "test",
                stock: true
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/books', function () {
    afterEach(async () => {
        await removeTestBook();
    })

    beforeEach(async () => {
        await createTestBookMany();
    })

    it('should can get all books', async () => {
        const result = await supertest(web)
            .get('/api/books');

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
    });
});

describe('DELETE /api/books/:bookId', function () {
    afterEach(async () => {
        await removeTestBook();
    })

    beforeEach(async () => {
        await createTestBook();
    })

    it('should can delete a book', async () => {
        let testBook = await getTestBook();

        const result = await supertest(web)
            .delete('/api/books/' + testBook.id);

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Book deleted successfully");

        testBook = await getTestBook();
        expect(testBook).toBeNull();
    });

    it('should reject if book not found', async () => {
        let testBook = await getTestBook();

        const result = await supertest(web)
            .delete('/api/books/' + (testBook.id + 1));

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});