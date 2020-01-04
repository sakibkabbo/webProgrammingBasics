/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
        const bookName = document.querySelector('#newBookName').value
        const bookAuthor = document.querySelector('#newBookAuthor').value
        const bookGenre = document.querySelector('#newBookGenre').value
        const bookToBeAdded = new Book(bookName, bookAuthor, bookGenre)
        libraryBooks.push(bookToBeAdded)
        
	// Call addBookToLibraryTable properly to add book to the DOM
        
        addBookToLibraryTable(bookToBeAdded);
	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
        const loanBookId = document.querySelector('#loanBookId').value
        const loanCardNum = document.querySelector('#loanCardNum').value
        
        const bookToBeLoaned = libraryBooks[loanBookId]
        const borrowingPatron = patrons[loanCardNum]

	// Add patron to the book's patron property
        bookToBeLoaned.patron = borrowingPatron	
        

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(bookToBeLoaned)

	// Start the book loan timer.
	libraryBooks[loanBookId].setLoanTime()

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
        if (e.target.classList.contains('return')) {
            const tableElem = e.target.ParentElement.nodeName
            console.log(tableElem)
        
	// Call removeBookFromPatronTable()


	// Change the book object to have a patron of 'null'
        
        }

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
        const newPatronName = document.querySelector('#newPatronName').value
        const newPatron = new Patron(newPatronName)
        patrons.push(newPatron)

	// Call addNewPatronEntry() to add patron to the DOM
        addNewPatronEntry(newPatron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
        const searchedBook = document.querySelector('#bookInfoId').value
        let book = null
        for (let i = 0; i < libraryBooks.length; i++){
            if (libraryBooks[i].bookId == searchedBook){
               book = libraryBooks[i]
            }
        }
        
	// Call displayBookInfo()
        displayBookInfo(book)             

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        
        td1.appendChild(document.createTextNode(book.bookId))
        const authorText = document.createTextNode(book.title)
        const boldText = document.createElement('strong')
        boldText.appendChild(authorText)
        td2.appendChild(boldText)
        td3.appendChild(document.createTextNode(""))
        
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        
        bookTable.firstElementChild.appendChild(tr)
        console.log(bookTable.firstElementChild.childNodes.length)
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	
        const p1 = document.createElement('P')
        p1.innerHTML = "Book Id: "
        const s1 = document.createElement('span')
        const id = document.createTextNode(book.bookId)
        console.log(id)
        s1.appendChild(id)
        p1.appendChild(s1)
        
        const p2 = document.createElement('P')
        p2.innerHTML = "Title: "        
        const s2 = document.createElement('span')
        s2.appendChild(document.createTextNode(book.title))
        p2.appendChild(s2)
        
        const p3 = document.createElement('P')
        p3.innerHTML = "Author: "        
        const s3 = document.createElement('span')
        s3.appendChild(document.createTextNode(book.author))
        p3.appendChild(s3)
                
        const p4 = document.createElement('P')
        p4.innerHTML = "Genre: "        
        const s4 = document.createElement('span')
        s4.appendChild(document.createTextNode(book.genre))
        p4.appendChild(s4)
        
        const p5 = document.createElement('P')
        p5.innerHTML = "Currently loaded to: "        
        const s5 = document.createElement('span')
        if (book.patron == null){
            s5.appendChild(document.createTextNode("N/A"))
        }
        else{
            s5.appendChild(document.createTextNode(book.patron.name))
        }
        p5.appendChild(s5)
        
        while(bookInfo.hasChildNodes()){
           bookInfo.removeChild(bookInfo.firstChild)
        }
        bookInfo.appendChild(p1)
        bookInfo.appendChild(p2)
        bookInfo.appendChild(p3)
        bookInfo.appendChild(p4)
        bookInfo.appendChild(p5)
        
        

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	
        
        
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        
        td1.appendChild(document.createTextNode(book.bookId))
        const authorText = document.createTextNode(book.title)
        const boldTitle = document.createElement('strong')
        boldTitle.appendChild(authorText)
        td2.appendChild(boldTitle)
        
        const bookStatus = document.createTextNode('Within due date')
        td3.className = 'green'
        const boldStatus = document.createElement('strong')
        boldStatus.appendChild(bookStatus)
        td3.appendChild(boldStatus)
        
        
        const returnButton = document.createElement('button')
        returnButton.className = 'button'
        returnButton.addEventListener('click', returnBookToLibrary)
        returnButton.appendChild(document.createTextNode('return'))
        td4.appendChild(returnButton)
        
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        
        
        const bookPatron = book.patron
        for (let i = 0; i < patrons.length; i++){
           if (patronEntries.getElementsByClassName('patron')[i].firstElementChild.firstElementChild.textContent === bookPatron.name){
             patronEntries.getElementsByClassName('patronLoansTable')[i].firstElementChild.appendChild(tr)
             break
           }        
       }
       for(let j = 2; j < bookTable.firstElementChild.childNodes.length; j+=2){
           if (bookTable.firstElementChild.childNodes[j].children[0].textContent == book.bookId){
               bookTable.firstElementChild.childNodes[j].children[2].innerHTML = bookPatron.cardNumber
               break
           }
       }
            if (bookTable.firstElementChild.childNodes.length > 8){
              for(let k = 9; k < bookTable.firstElementChild.childNodes.length; j++){
                 if (bookTable.firstElementChild.childNodes[k].children[0].textContent == book.bookId){
                     bookTable.firstElementChild.childNodes[k].children[2].innerHTML = bookPatron.cardNumber
                     break
                }
              }
            } 
        

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	
        const d1 = document.createElement("div")
        d1.className = 'patron'
        
        const p1 = document.createElement('P')
        p1.innerHTML = "Name: "
        const sp1 = document.createElement('span')
        sp1.className = 'bold'
        const patronName = document.createTextNode(patron.name)
        sp1.appendChild(patronName)
        p1.appendChild(sp1)
        
        const p2 = document.createElement('P')
        p2.innerHTML = "Card Number: "
        const sp2 = document.createElement("span")
        sp2.className = 'bold'
        const patronCardNumber = document.createTextNode(patron.cardNumber)
        sp2.appendChild(patronCardNumber)
        p2.appendChild(sp2)
        
        const header1 = document.createElement("h4")
        header1.appendChild(document.createTextNode('Books on loan:'))
        
        const t1 = document.createElement("table")
        t1.className = 'patronLoansTable'
        const tbody = document.createElement('tbody')
        const tr1 = document.createElement("tr")
        
        const th1 = document.createElement("th")
        th1.appendChild(document.createTextNode("BookID"))
        const th2 = document.createElement("th")
        th2.appendChild(document.createTextNode("Title"))
        const th3 = document.createElement("th")
        th3.appendChild(document.createTextNode("Status"))
        const th4 = document.createElement("th")
        th4.appendChild(document.createTextNode("Return"))
        
        tr1.appendChild(th1)
        tr1.appendChild(th2)
        tr1.appendChild(th3)
        tr1.appendChild(th4)        
        tbody.appendChild(tr1)
        t1.appendChild(tbody)
        
        d1.appendChild(p1)
        d1.appendChild(p2)
        d1.appendChild(header1)
        d1.appendChild(t1)
        
        patronEntries.appendChild(d1)
        

        

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	
        console.log('clicked')

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	
          
        const trowsofpain = patronEntries.getElementsByClassName('patronLoansTable')[0].rows
        for (let pain = 1; pain < patronEntries.getElementsByClassName('patronLoansTable')[0].rows.length; pain++){
            if (trowsofpain[pain].innerText.includes(book.patron.name)){
                const td = document.createElement('td')
                const bookStatus = document.createTextNode('Overdue')
                const boldStatus = document.createElement('strong')
                boldStatus.appendChild(bookStatus)
                td.appendChild(boldStatus)
                td.className = "red"
                trowsofpain[pain].replaceChild(td, trowsofpain[pain].childNodes[5])
                break
            }  
        }       
        for(let i = 1; i < patronEntries.getElementsByClassName('patronLoansTable').length; i++){
        const trows = patronEntries.getElementsByClassName('patronLoansTable')[i].rows
        for(let j = 1; j < trows.length; j++){
            if (trows[j].innerText.includes(book.patron.name)){
                const td = document.createElement('td')
                const bookStatus = document.createTextNode('Overdue')
                const boldStatus = document.createElement('strong')
                boldStatus.appendChild(bookStatus)
                td.appendChild(boldStatus)
                td.className = "red"
                trowsofpain[pain].replaceChild(td, trowsofpain[pain].childNodes[3])
                break
            }
          }
        }
}

