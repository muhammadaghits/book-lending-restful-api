import {validate} from "../validation/validation.js";
import {createBookValidation, getBookValidation} from "../validation/book-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const createBook = async (request) => {
    const book = validate(createBookValidation, request);

    const countBook = await prismaClient.book.count({
        where: {
            code: book.code
        }
    });

    if (countBook === 1) {
        throw new ResponseError(400, "Book code already exist");
    }

    return prismaClient.book.create({
        data: book,
        select: {
            id: true,
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });
}

const getBook = async () => {
    return prismaClient.book.findMany({
        select: {
            id: true,
            code: true,
            title: true,
            author: true,
            stock: true
        }
    });
}

const deleteBook = async (bookId) => {
    bookId = validate(getBookValidation, bookId);

    const countBook = await prismaClient.book.count({
        where: {
            id: bookId,
            stock : true
        }
    });

    if (countBook !== 1) {
        throw new ResponseError(404, "Book not found / Book is borrowing");
    }

    return prismaClient.book.delete({
        where: {
            id: bookId
        }
    });
}

export default {
    createBook,
    getBook,
    deleteBook
}