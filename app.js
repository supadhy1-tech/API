
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const booksFile = path.join(__dirname, 'books.json');


app.use(express.json());

// Helper function to read books.json
const readBooks = () => {
    if (!fs.existsSync(booksFile)) {
        fs.writeFileSync(booksFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(booksFile));
};

// Helper function to write to books.json
const writeBooks = (books) => {
    fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
};

// GET /books - Retrieve all books
app.get('/books', (req, res) => {
    const books = readBooks();
    res.json(books);
});

// POST /books - Add a new book
app.post('/books', (req, res) => {

    const { title, author, publicationYear } = req.body;

    if (!title || !author || !publicationYear) {
        return res.status(400).json({ error: 'Title, author, and publication year are required' });
    }

    let books = readBooks(); // Read books.json


    const newBook = { id: books.length + 1, title, author, publicationYear };

    books.push(newBook);

    writeBooks(books); // Save back to books.json

    res.status(201).json(newBook);
});


// PUT /books/:id - Update an existing book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const { title, author, publicationYear } = req.body;
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id == id);
    console.log(bookIndex)
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books[bookIndex] = { id: parseInt(id), title, author, publicationYear };
    writeBooks(books);
    res.json(books[bookIndex]);
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    let books = readBooks();
    const newBooks = books.filter(book => book.id != id);
    if (books.length === newBooks.length) {
        return res.status(404).json({ error: 'Book not found' });
    }
    writeBooks(newBooks);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
