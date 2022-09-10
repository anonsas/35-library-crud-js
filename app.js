// ***** SELECT ITEMS *****
const form = document.getElementById('library-form');
let titleInput = document.getElementById('title-input');
let priceInput = document.getElementById('price-input');
let submitBtn = document.getElementById('submit-btn');
const list = document.getElementById('library-list');
//=======================================================
// ***** LOCAL STORAGE *****
function getLocalStorage() {
  return localStorage.getItem('bookList')
    ? JSON.parse(localStorage.getItem('bookList'))
    : [];
}
function addBookToLocalStorage(id, title, price) {
  const booksLS = getLocalStorage();
  const newBook = { id, title, price };
  booksLS.push(newBook);
  localStorage.setItem('bookList', JSON.stringify(booksLS));
}

function deleteBookFromLocalStorage(id) {
  let booksLS = getLocalStorage();
  booksLS = booksLS.filter((book) => book.id !== id);
  localStorage.setItem('bookList', JSON.stringify(booksLS));
}

function editBookInLocalStorage(id, title, price) {
  let booksLS = getLocalStorage();
  booksLS = booksLS.map((book) => (book.id === id ? { ...book, title, price } : book));
  localStorage.setItem('bookList', JSON.stringify(booksLS));
}

//=======================================================
// ***** INITIAL SETUP *****
let isEditing = false;
let editID = '';
let editBookTitle = '';
let editBookPrice = '';

function setBackToDefault() {
  titleInput.value = '';
  priceInput.value = '';
  isEditing = false;
  editID = '';
  editBookTitle = '';
  editBookPrice = '';
  submitBtn.textContent = 'Register';
}

function loadAllBooks() {
  const booksLS = getLocalStorage();
  booksLS.forEach((book) => addBookToList(book.id, book.title, book.price));
}

//=======================================================
// ***** FUNCTIONS *****
function submitFormHandler(e) {
  e.preventDefault();

  const id = crypto.randomUUID();
  const title = titleInput.value;
  const price = priceInput.value;

  if (title && price && !isEditing) {
    addBookToList(id, title, price);
    addBookToLocalStorage(id, title, price);
    setBackToDefault();
  } else if (title && price && isEditing) {
    editBookTitle.innerHTML = title;
    editBookPrice.innerHTML = price;
    editBookInLocalStorage(editID, title, price);
    setBackToDefault();
  } else {
    alert('Please fill in the blanks');
  }
}

function addBookToList(id, title, price) {
  const html = `
    <article class='list__item' data-id=${id}>
      <div class='list__item--content'>
        <p>${title}</p>
        <p>${price}</p>
      </div>
      <div>
        <button type='button' class='edit-btn'>Edit</button>
        <button type='button' class='delete-btn'>Delete</button>
    </div>
    </article>
  `;

  list.insertAdjacentHTML('afterbegin', html);

  const editBtn = document.querySelector('.edit-btn');
  const deleteBtn = document.querySelector('.delete-btn');

  editBtn.addEventListener('click', editBookHandler);
  deleteBtn.addEventListener('click', deleteBookHandler);
}

function editBookHandler(e) {
  isEditing = true;
  submitBtn.textContent = 'Edit';

  const bookContainer = e.target.closest('.list__item');

  editID = bookContainer.dataset.id;
  editBookTitle = bookContainer.querySelector('.list__item--content p:nth-child(1)');
  editBookPrice = bookContainer.querySelector('.list__item--content p:nth-child(2)');

  titleInput.value = editBookTitle.innerHTML;
  priceInput.value = editBookPrice.innerHTML;
}

function deleteBookHandler(e) {
  const bookContainer = e.target.closest('.list__item');
  const { id } = bookContainer.dataset;
  list.removeChild(bookContainer);
  deleteBookFromLocalStorage(id);
  setBackToDefault();
}

//=======================================================
// ***** EVENT LISTENERS *****
form.addEventListener('submit', submitFormHandler);
window.addEventListener('DOMContentLoaded', loadAllBooks);
