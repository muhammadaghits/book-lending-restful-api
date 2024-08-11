import express from "express";
import memberController from "../controller/member-controller.js";
import bookController from "../controller/book-controller.js";
import transactionController from "../controller/transaction-controller.js";


const router = new express.Router();

// Member API Route
router.get('/api/members', memberController.getMember);
router.post('/api/members', memberController.createMember);
router.delete('/api/members/:memberId', memberController.deleteMember);

// Book API Route
router.get('/api/books', bookController.getBook);
router.post('/api/books', bookController.createBook);
router.delete('/api/books/:bookId', bookController.deleteBook);

// Transaction API Route
router.get('/api/borrow', transactionController.getTransaction);
router.post('/api/borrow', transactionController.createTransaction);
router.post('/api/return', transactionController.deleteTransaction);

export {
    router
}