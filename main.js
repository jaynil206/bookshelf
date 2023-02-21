// First, check if there is any stored data in session storage that should be displayed
if (sessionStorage.getItem("books")) {
    // If there is, get the data and parse it into an array
    let books = JSON.parse(sessionStorage.getItem("books"));
  
    // Loop through the array and add each book to the shelf
    books.forEach(book => {
      addToShelf(book);
    });
  } else {
    // If there is no stored data, initialize an placeholder array
    sessionStorage.setItem("books", JSON.stringify([]));
    // Add a placeholder book for the user to see an example
    const book = {
        title: 'Book Title', 
        author: 'Author',
        genre: 'Genre',
        id: '0000001', 
    };
    // Add the book to the shelf and to session storage
    addToShelf(book);
    addToStorage(book);
    
}

// Handle functionality for the add button on the form
const addButton = document.querySelector('#add-book-button'); 
// Only make the add button enabled when all sections of the form are filled in
const form = document.querySelector('form'); 
form.addEventListener("input", (event) => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const id = Math.round(Math.random() * 10000000); 
    // if all have truthy values, then enable the button
    if (title && author && genre) {
        addButton.removeAttribute('disabled'); 
    } 
}); 

// Add event listener to the add book button
addButton.addEventListener("click", function() {       
    // Get the values from the form inputs
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    // Give each book a unique id
    const id = Math.round(Math.random() * 10000000); 
    // Create the book object with the input values
    const book = {
        title: title,
        author: author,
        genre: genre,
        // The id will have a css ruleset setting its display to none - it is purely used as a tag to access storage
        id: id, 
    };
    
    // Add the book to the shelf and to session storage
    addToShelf(book);
    addToStorage(book);

    // Reset the form by clearing the input fields and disabling the add button again. 
    form.reset(); 
    addButton.setAttribute('disabled', 'true'); 
});

// write the function for adding a book to the shelf. 
function addToShelf(item) {
    // create a new book element
    let newBook = document.createElement("div"); 
    newBook.classList.add("book"); 
    // give the book its html structure with information and buttons
    newBook.innerHTML = `
        <div class="information">
            <h3 class="title">${item.title}</h3>
            <h5 class="author">${item.author}</h5>
            <p class="genre">${item.genre}</p>
            <p class="id">${item.id}</p>
        </div>
        <div class="interactive">
            <button type="button" id="edit" class="edit">edit</button>
            <button type="button" id="remove" class="remove" value="remove">x</button> 
        </div> 
    `; 
    // add the book as a child of bookshelf
    let bookshelf = document.querySelector('.bookshelf'); 
    bookshelf.insertBefore(newBook, bookshelf.firstChild); 
}


// write the function for adding a book to the session storage. 
function addToStorage(item) {
    // Get the books from session storage and parse them into an array
    let bookArray = JSON.parse(sessionStorage.getItem("books"));
    // Add the new book to the array and save it to session storage
    bookArray.push(item);
    sessionStorage.setItem("books", JSON.stringify(bookArray));
}

// handle functionality for the edit buttons
let isEditing = false; 
let bookshelf = document.querySelector('.bookshelf');

// add an event listener that triggers actions when any edit button is clicked
bookshelf.addEventListener("click", function(event) {
    // if an 'edit' button is clicked....
    if (event.target.classList.contains("edit")) {
        // get the book and its information
        let book = event.target.closest('.book');
        let title = book.querySelector('.title'); 
        let author = book.querySelector('.author'); 
        let genre = book.querySelector('.genre'); 
        let id = book.querySelector('.id'); 
        // use an if else statement so that the button can function as both an edit and a save
        if (!isEditing) {
            // code for editing - add a css class, change the button
            isEditing = true; 
            book.classList.add('edit-mode'); 
            book.classList.add('edit-button-active');
            event.target.textContent = 'save changes'; 
            event.target.classList.add('save-changes'); 
            // hide the remove button 
            let removeButton = book.querySelector('.remove'); 
            removeButton.style.display = 'none'; 
            // make the information editable 
            title.setAttribute('contentEditable', isEditing); 
            title.focus(); 
            author.setAttribute('contentEditable', isEditing); 
            genre.setAttribute('contentEditable', isEditing); 
        } else {
            // identify the book's index in the session storage
            console.log(title); 
            let bookArray = JSON.parse(sessionStorage.getItem("books")); 
            let bookIndex; 
            for (let i = 0; i < bookArray.length; i++) {
                if (bookArray[i].id == id.textContent) {
                    bookIndex = i; 
                    break; 
                } 
            }
            console.log(bookIndex); 
            if (bookIndex === undefined) {
                console.log("Book not found in the array");
                return;
            }
            const updatedBook = {
                title: title.textContent, 
                author: author.textContent,
                genre: genre.textContent,
                id: id.textContent,
            }; 
            bookArray[bookIndex] = updatedBook;
            sessionStorage.setItem("books", JSON.stringify(bookArray));


            // reset the edit button back to default
            event.target.textContent = 'edit'; 
            event.target.classList.remove('save-changes'); 
            book.classList.remove('edit-mode'); 
            isEditing = false; 
            title.setAttribute('contentEditable', isEditing); 
            author.setAttribute('contentEditable', isEditing); 
            genre.setAttribute('contentEditable', isEditing); 
            // redisplay the remove button 
            let removeButton = book.querySelector('.remove'); 
            removeButton.removeAttribute('style'); 
        }
    }
});

// handle functionality for removing an item 
bookshelf.addEventListener("click", function(event) {
    // add an alert that asks the user if they are sure they want to delete
    if (event.target.classList.contains('remove')) {
        if (confirm('Are you sure you want to remove this book?')) {
            // remove book from storage
            let book = event.target.closest('.book');
            let id = book.querySelector('.id');  
            let bookArray = JSON.parse(sessionStorage.getItem("books")); 
            bookArray.forEach(item => {
                if (item.id == id.textContent) {
                    bookArray.splice(bookArray.indexOf(item), 1); 
                }
            }); 
            // update the storage
            sessionStorage.setItem("books", JSON.stringify(bookArray)); 
            // delete the html element
            book.remove(); 
        }
    }
}); 





