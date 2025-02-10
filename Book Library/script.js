document.addEventListener("DOMContentLoaded", function () {
    preloadBooks();
    loadBooks();
});

function preloadBooks() {
    if (!localStorage.getItem("books")) {
        let defaultBooks = [
            { title: "Book 1", author: "Author A", category: "Fiction", available: true },
            { title: "Book 2", author: "Author B", category: "Science", available: true },
            { title: "Book 3", author: "Author C", category: "History", available: true },
            { title: "Book 4", author: "Author D", category: "Technology", available: true },
            { title: "Book 5", author: "Author E", category: "Art", available: true }
        ];
        localStorage.setItem("books", JSON.stringify(defaultBooks));
    }
}

function loadBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let bookTable = document.querySelector("#bookTable tbody");
    bookTable.innerHTML = "";

    books.forEach((book, index) => {
        let row = `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.available ? "Yes" : "No"}</td>
            <td>
                <button onclick="borrowBook(${index})" ${!book.available ? "disabled" : ""}>Borrow</button>
                <button onclick="returnBook(${index})" ${book.available ? "disabled" : ""}>Return</button>
                <button onclick="deleteBook(${index})">Delete</button>
            </td>
        </tr>`;
        bookTable.innerHTML += row;
    });

    loadBorrowHistory();
}

function addBook() {
    let title = document.getElementById("title").value.trim();
    let author = document.getElementById("author").value.trim();
    let category = document.getElementById("category").value.trim();

    if (title && author) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.push({ title, author, category, available: true });
        localStorage.setItem("books", JSON.stringify(books));
        loadBooks();
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("category").value = "";
    }
}

function borrowBook(index) {
    let books = JSON.parse(localStorage.getItem("books"));
    if (books[index].available) {
        books[index].available = false;
        localStorage.setItem("books", JSON.stringify(books));

        let history = JSON.parse(localStorage.getItem("borrowHistory")) || [];
        history.push(`${books[index].title} borrowed on ${new Date().toLocaleString()}`);
        localStorage.setItem("borrowHistory", JSON.stringify(history));

        loadBooks();
    }
}

function returnBook(index) {
    let books = JSON.parse(localStorage.getItem("books"));
    if (!books[index].available) {
        books[index].available = true;
        localStorage.setItem("books", JSON.stringify(books));
        loadBooks();
    }
}

function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books"));
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

function searchBooks() {
    let filter = document.getElementById("search").value.toLowerCase();
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let searchResults = document.getElementById("searchResults");

    searchResults.innerHTML = "";
    searchResults.style.display = "none";

    if (filter.length === 0) return;

    let matches = books.filter(book =>
        book.title.toLowerCase().includes(filter) ||
        book.author.toLowerCase().includes(filter) ||
        book.category.toLowerCase().includes(filter)
    ).slice(0, 50);

    if (matches.length > 0) {
        searchResults.style.display = "block";
        matches.forEach(book => {
            let div = document.createElement("div");
            div.innerHTML = `${book.title} - ${book.author} (${book.category})`;
            div.onclick = function () {
                alert(`Selected: ${book.title}`);
                searchResults.style.display = "none";
            };
            searchResults.appendChild(div);
        });
    }
}

function loadBorrowHistory() {
    let historyList = document.getElementById("borrowHistory");
    historyList.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    history.forEach(entry => {
        let listItem = document.createElement("li");
        listItem.innerText = entry;
        historyList.appendChild(listItem);
    });
}
