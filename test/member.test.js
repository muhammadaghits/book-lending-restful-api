import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestMember, createTestMemberMany, getTestMember, removeTestMember} from "./test-util.js";

describe('POST /api/members', function () {
   afterEach(async () => {
       await removeTestMember();
   })

    it('should can create a new member', async () => {
        const result = await supertest(web)
            .post('/api/members')
            .send({
                code: 'test',
                name: 'test'
            });

        logger.info(result.body);
        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.borrowedBook).toEqual(0);
        expect(result.body.data.returnDatePreviously).toBeNull();
        expect(result.body.data.penalty).toBe(false);
    });

   it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/members')
            .send({
                code: '',
                name: ''
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if member code already exist', async () => {
        let result = await supertest(web)
            .post('/api/members')
            .send({
                code: 'test',
                name: 'test'
            });

        expect(result.status).toBe(201);
        expect(result.body.data.code).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.borrowedBook).toEqual(0);
        expect(result.body.data.returnDatePreviously).toBeNull();
        expect(result.body.data.penalty).toBe(false);

        result = await supertest(web)
            .post('/api/members')
            .send({
                code: 'test',
                name: 'test'
            });

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/members', function () {
    afterEach(async () => {
        await removeTestMember();
    })

    beforeEach(async () => {
        await createTestMemberMany();
    })

    it('should can get all members', async () => {
        const result = await supertest(web)
            .get('/api/members');

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
    });
});

describe('DELETE /api/members/:memberId', function () {
    afterEach(async () => {
        await removeTestMember();
    })

    beforeEach(async () => {
        await createTestMember();
    })

    it('should can delete a member', async () => {
        let testMember = await getTestMember();

        const result = await supertest(web)
            .delete('/api/members/' + testMember.id);

        logger.info(result.body);
        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Member deleted successfully");

        testMember = await getTestMember();
        expect(testMember).toBeNull();
    });

    it('should reject if member not found', async () => {
        let testMember = await getTestMember();

        const result = await supertest(web)
            .delete('/api/members/' + (testMember.id + 1));

        logger.info(result.body);
        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});