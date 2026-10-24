
let books = JSON.parse(localStorage.getItem("books")) || [];

const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const message = document.getElementById("message");

// Save books in browser storage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Display books
function displayBooks() {
    let search = document.getElementById("search")
        .value.trim().toLowerCase();

    bookList.replaceChildren();

    let filteredBooks = books.filter(function(book) {
        return book.id.toLowerCase().includes(search) ||
               book.title.toLowerCase().includes(search) ||
               book.author.toLowerCase().includes(search);
    });

    if (filteredBooks.length === 0) {
        bookList.textContent = "No books found.";
        return;
    }

    filteredBooks.forEach(function(book) {
        let card = document.createElement("div");
        card.className = "book";

        let title = document.createElement("h3");
        title.textContent = book.title;

        let id = document.createElement("p");
        id.textContent = "Book ID: " + book.id;

        let author = document.createElement("p");
        author.textContent = "Author: " + book.author;

        let quantity = document.createElement("p");
        quantity.textContent = "Available: " + book.quantity;

        let issued = document.createElement("p");
        issued.textContent = "Issued: " + book.issued;

        card.append(title, id, author, quantity, issued);

        if (book.quantity > 0) {
            let issueButton = document.createElement("button");
            issueButton.textContent = "Issue Book";

            issueButton.addEventListener("click", function() {
                book.quantity--;
                book.issued++;
                saveBooks();
                displayBooks();
            });

            card.appendChild(issueButton);
        }

        if (book.issued > 0) {
            let returnButton = document.createElement("button");
            returnButton.textContent = "Return Book";

            returnButton.addEventListener("click", function() {
                book.quantity++;
                book.issued--;
                saveBooks();
                displayBooks();
            });

            card.appendChild(returnButton);
        }

        bookList.appendChild(card);
    });
}

// Add a new book
bookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.getElementById("bookId").value.trim();
    let title = document.getElementById("title").value.trim();
    let author = document.getElementById("author").value.trim();
    let quantity = Number(document.getElementById("quantity").value);

    let exists = books.some(function(book) {
        return book.id.toLowerCase() === id.toLowerCase();
    });

    if (exists) {
        message.textContent = "Book ID already exists.";
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        message.textContent = "Enter a valid quantity.";
        return;
    }

    books.push({
        id: id,
        title: title,
        author: author,
        quantity: quantity,
        issued: 0
    });

    saveBooks();

    message.textContent = "Book added successfully!";
    bookForm.reset();

    displayBooks();
});

// Search books
document.getElementById("searchButton").addEventListener(
    "click", displayBooks
);

document.getElementById("search").addEventListener(
    "input", displayBooks
);

// Show saved books when opening the page
displayBooks();
