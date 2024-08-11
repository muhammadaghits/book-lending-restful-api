import {prismaClient} from "../src/application/database.js";

export const removeTestMember = async () => {
    await prismaClient.member.deleteMany();
}

export const createTestMember = async () => {
    await prismaClient.member.create({
        data: {
            code: 'test',
            name: 'test'
        }
    });
}

export const getTestMember = async () => {
    return prismaClient.member.findUnique({
        where: {
            code: "test"
        }
    });
}

export const createTestMemberMany = async () => {
    for (let i = 0; i < 5; i++) {
        await prismaClient.member.createMany({
            data: {
                code: `test ${i}`,
                name: `test ${i}`
            }
        });
    }
}

export const removeTestBook = async () => {
    await prismaClient.book.deleteMany();
}

export const createTestBook = async () => {
    await prismaClient.book.create({
        data: {
            code: "test",
            title: "test",
            author: "test",
            stock: true
        }
    });
}

export const getTestBook = async () => {
    return prismaClient.book.findUnique({
        where: {
            code: "test"
        }
    });
}

export const createTestBookMany = async () => {
    for (let i = 0; i < 5; i++) {
        await prismaClient.book.create({
            data: {
                code: `test ${i}`,
                title: `test ${i}`,
                author: `test ${i}`,
                stock: true
            }
        });
    }
}

export const removeTestTransaction = async () => {
    await prismaClient.transaction.deleteMany();
}

export const createTestTransaction = async () => {
    await prismaClient.transaction.create({
        data: {
            memberCode: "test",
            bookCode: "test",
            borrowedDate: "2024-01-01"
        }
    });
}

export const createTestTransactionMany = async () => {
    for (let i = 0; i < 5; i++) {
        await prismaClient.transaction.createMany({
            data: {
                memberCode: `test ${i}`,
                bookCode: `test ${i}`,
                borrowedDate: "2024-01-01"
            }
        });
    }
}