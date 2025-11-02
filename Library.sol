// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Library{
    // estructura para la representacion de un libro
    struct Book{
        uint256 id;
        string title;
        string author;
        string publisher;
        uint256 year;
        bool onLoan;
        address registeredBy;
    }
    // mappin para almacenar libros por ID
    mapping(uint256 => Book) public books;

    //array para mantener el registro de todos los IDs
    uint256[] public booksIds;
    // contador para generar Ids unicos
    uint256 private nextBookId;

    //evento para registrar acciones
    event BookRegistered(
        uint256 indexed bookId,
        string title,
        string author, 
        address indexed registeredBy
    );
    event LoanStatusChanged(
        uint256 indexed bookId,
        bool onLoan,
        address indexed changeBy
    );

    //funcon para registrar un nuevo libro
    function registerBook(
        string memory _title,
        string memory _author,
        string memory _publisher,
        uint256 _year
    ) public returns (uint256){
        require(bytes(_title).length>0,"el titulo no puede estar vacio");
        require(bytes(_author).length>0,"el autor no puede estar vacio");
        require(_year>0 && _year<=2025,"Anio invalido");

        uint256 bookId = nextBookId;
        nextBookId++;

        Book memory newBook=Book({
            id:bookId,
            title:_title,
            author:_author,
            publisher:_publisher,
            year:_year,
            onLoan:false,
            registeredBy:msg.sender
        });

        books[bookId]=newBook;
        booksIds.push(bookId);

        emit BookRegistered(bookId, _title, _author, msg.sender);
        return bookId;
    }

    //funcion para cambiar el estado de prestamo
    function toggleLoanStatus(uint256 _bookId) public {
        require(_bookId < nextBookId,"el libro no existe");

        Book storage book = books[_bookId];
        book.onLoan =! book.onLoan;
        emit LoanStatusChanged(_bookId, book.onLoan, msg.sender);
    }

    //funcion para obtener informacion de un libro especifico
    function getBook(uint256 _bookId)public view returns(
        uint256 id,
        string memory title,
        string memory author,
        string memory publisher,
        uint256 year,
        bool onLoan,
        address registeredBy
    ){
        require(_bookId<nextBookId,"el libro no existe");
        Book memory book=books[_bookId];
        return(
            book.id,
            book.title,
            book.author,
            book.publisher,
            book.year,
            book.onLoan,
            book.registeredBy 
        );
    }

    //funcion para obtener todos los IDs de libros
    function getAllBookIds()public view returns(uint256[] memory){return booksIds;}

    //funcion para obtener el numero total de libros
    function getTotalBooks() public view returns(uint256){
        return booksIds.length;
    }
    //funcion para obtener todos los libros
    function getAllBooks()public view returns(Book[] memory){
        Book[]memory allBooks=new Book[](booksIds.length);
        for (uint256 i=0;i<booksIds.length;i++){
            allBooks[i]=books[booksIds[i]];
        }
        return allBooks;
    }
}
