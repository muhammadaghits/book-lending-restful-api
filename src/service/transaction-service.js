import {validate} from "../validation/validation.js";
import {createBorrowValidation, createReturnValidation} from "../validation/transaction-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {response} from "express";

const createTransaction = async (request) => {
    const transaction = validate(createBorrowValidation, request);

    const member = await prismaClient.member.findFirst({
        where: {
            code: transaction.memberCode
        }
    });

    if (!member) {
        throw new ResponseError(404, "Member not found");
    }

    if (member.borrowedBook >= 2) {
        throw new ResponseError(400, "Member can't borrow more than 2 books, return the book first before borrowing another book.");
    }

    if (member.penalty === true) {
        const returnDP = member.returnDatePreviously;
        const date = new Date(returnDP);
        const date2 = new Date(transaction.borrowedDate);
        const time = date.getTime();
        const time2 = date2.getTime();
        const diff = (time2/(1000 * 60 * 60 *24)) - (time/(1000 * 60 * 60 *24));

        if (diff <= 3) {
            throw new ResponseError(400, "Member is currently penalized");
        }

        await prismaClient.member.update({
            where: {
                code: transaction.memberCode
            },
            data: {
                penalty: false
            }
        })
    }

    const book = await prismaClient.book.findFirst({
        where: {
            code: transaction.bookCode
        }
    });

    if (!book) {
        throw new ResponseError(404, "Book not found");
    }

    if (book.stock === false) {
        throw new ResponseError(400, "Book is already borrowed by other member");
    }

    const result = await prismaClient.transaction.create({
        data: {
            memberId :member.id,
            bookId : book.id,
            borrowedDate : transaction.borrowedDate
        },
        select: {
            id: true,
            borrowedDate: true,
            member: {
                select: {
                    code: true,
                    name: true
                }
            },
            book: {
                select: {
                    code: true,
                    title: true,
                    author: true
                }
            }
        }
    });

    await prismaClient.member.update({
        where: {
            code: transaction.memberCode
        },
        data: {
            borrowedBook: {
                increment: 1
            }
        }
    });

    await prismaClient.book.update({
        where: {
            code: transaction.bookCode
        },
        data: {
            stock: false
        }
    });

    return result;
}

const getTransaction = async () => {
    return prismaClient.transaction.findMany({
        select: {
            id: true,
            borrowedDate: true,
            member: {
                select: {
                    code: true,
                    name: true
                }
            },
            book: {
                select: {
                    code: true,
                    title: true,
                    author: true
                }
            }
        }
    })
}

const deleteTransaction = async (request) => {
    const transaction = validate(createReturnValidation, request);

    const member = await prismaClient.member.findUnique({
        where: {
            code: transaction.memberCode
        }
    });

    if (!member) {
        throw new ResponseError(404, "Member not found");
    }

    const book = await prismaClient.book.findUnique({
        where: {
            code: transaction.bookCode
        }
    });

    if (!book) {
        throw new ResponseError(404, "Book not found");
    }

    const borrow = await prismaClient.transaction.findUnique({
        where: {
            memberId : member.id,
            bookId : book.id,
            returnDate : null
        }
    });

    if (!borrow) {
        throw new ResponseError(404, "Member doesn't borrow this book");
    }

    const date = new Date(transaction.returnDate)
    const date2 = new Date(borrow.borrowedDate)
    const time = date.getTime()
    const time2 = date2.getTime()
    const diff = (time/(1000 * 60 * 60 *24)) - (time2/(1000 * 60 * 60 *24));

    if (diff > 7) {
        await prismaClient.member.update({
            where: {
                code: member.code
            },
            data: {
                penalty: true
            }
        });
        // response.status(200).json({
        //     message: "Member get penalty"
        // });
    } else {
        await prismaClient.member.update({
            where: {
                code: member.code
            },
            data: {
                penalty: false
            }
        });
    }

    await prismaClient.transaction.delete({
        where: {
            memberId: member.id,
            bookId: book.id
        },
    });

    await prismaClient.member.update({
        where: {
            code: member.code
        },
        data: {
            borrowedBook: {
                decrement: 1
            },
            returnDatePreviously: transaction.returnDate
        }
    });

    await prismaClient.book.update({
        where: {
            code: book.code
        },
        data: {
            stock: true
        }
    });
}

export default {
    createTransaction,
    getTransaction,
    deleteTransaction
}