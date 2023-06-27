// Import dependencies
const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

// Placeholder array to store books
const books = [];

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost'
  });

  // Route to save a book
  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      // ... (existing code to save a book)

      // Save the book to the array
      books.push(book);

      // Return success response
      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      }).code(201);
    }
  });

  // Route to get all books
  server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const { name, reading, finished } = request.query;

      let filteredBooks = books;

      if (name) {
        const keyword = name.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
          book.name.toLowerCase().includes(keyword)
        );
      }

      if (reading) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(book =>
          book.reading === isReading
        );
      }

      if (finished) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(book =>
          book.finished === isFinished
        );
      }

      const mappedBooks = filteredBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }));

      return h.response({
        status: 'success',
        data: {
          books: mappedBooks
        }
      }).code(200);
    }
  });

  // Route to get book detail by ID
  server.route({
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;

      const book = books.find(b => b.id === bookId);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: {
          book
        }
      }).code(200);
    }
  });

  // Route to update book data by ID
  server.route({
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      const bookIndex = books.findIndex(b => b.id === bookId);

      if (bookIndex === -1) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
      }

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
      }

      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString()
      };

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      }).code(200);
    }
  });

  // Route to delete a book by ID
  server.route({
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;

      const bookIndex = books.findIndex(b => b.id === bookId);

      if (bookIndex === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
      }

      books.splice(bookIndex, 1);

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      }).code(200);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
