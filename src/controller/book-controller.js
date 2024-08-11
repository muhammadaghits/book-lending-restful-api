import bookService from "../service/book-service.js";

const createBook = async (req, res, next) => {
    try {
        const result = await bookService.createBook(req.body);
        res.status(201).json({
            data: result,
            message: "Book created successfully"
        });
    } catch (e) {
        next(e);
    }
}

const getBook = async (req, res, next) => {
    try {
        const result = await bookService.getBook();
        if (!result) {
            res.status(200).json({
                message: "Data is empty"
            });
        }
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;

        await bookService.deleteBook(bookId);
        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    createBook,
    getBook,
    deleteBook
}