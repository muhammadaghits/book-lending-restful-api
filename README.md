# book-lending-restful-api
[![Generic badge](https://img.shields.io/badge/npm-9.8.1-blue.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/node-v18.18.2-green.svg)](https://shields.io/)

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [RESTful API Endpoints](#restful-api-endpoints)
* [Setup](#setup)

## General Info
The Book Lending is an RESTful API that lets members borrow and return books from a library. It provides endpoints to show book information, member information, and do borrowing-returning book transactions. This app built with ExpressJS and MySQL.

### Features
* Members can borrow books with conditions:
    - [x]  Members may not borrow more than 2 books
    - [x]  Members can't borrow books that are unavailable
    - [x]  Borrowed books are not borrowed by other members
    - [x]  Member is currently not being penalized
    - [x]  Member with penalty can't able to borrow the book for 3 days

* Member can returns the book with conditions:
    - [x]  The returned book is a book that the member has borrowed
    - [x]  If the book is returned after more than 7 days, the member will be subject to a penalty.

* Check the book:
    - [x]  Shows all existing books and quantities
    - [x]  Books that are being borrowed are not counted

* Member check:
    - [x]  Shows all existing members
    - [x]  The number of books being borrowed by each member

## Technologies
Project is created with:
* node : 18.18.2
* express : 4.19.2
* prisma : 5.18.0
* jest : 29.7.0
* supertest: 7.0.0
* joi: 17.13.3, 
* winston: 3.13.1

## RESTful API Endpoints
### API Endpoints
RESTful API Endpoints are shown in the table below:
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/members` | Get all members |
| POST | `/api/members` | Add member |
| DELETE | `/api/members/:memberId` | Delete member |
| GET | `/api/books`| Get all books |
| POST | `/api/books` | Add book |
| DELETE | `/api/books/:bookId` | Delete book |
| GET | `/api/borrow`| Get all transaction exist |
| POST | `/api/borrow` | Borrow a book |
| POST | `/api/return` | Return a book |

### Swagger
Feel free to view REST API documentation with Swagger by entering this endpoint:
| Endpoint | Description |
| --- | --- |
| `/docs` | View Documentation |

## Setup
To run this project, install it locally using npm:
```
$ cd book-lending-restful-api
$ npm install
```
please add .env before run the application, the suggested .env is bellow:
```
DATABASE_URL="mysql://DB_USERNAME:DB_PASSWORD@DB_HOST:PORT/DB_NAME"
```
here is the code for the migration:
```
$ npx prisma migrate dev 
```
after that, you can use the app by:
```
$ npm start
```
