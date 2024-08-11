import transactionService from "../service/transaction-service.js";

const createTransaction = async (req, res, next) => {
    try {
        const result = await transactionService.createTransaction(req.body);
        res.status(201).json({
            data: result,
            message: "Book borrowed successfully"
        });
    } catch (e) {
        next(e);
    }
}

const getTransaction = async (req, res, next) => {
    try {
        const result = await transactionService.getTransaction();
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.body);
        res.status(200).json({
            message: "Book returned successfully"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    createTransaction,
    getTransaction,
    deleteTransaction
}