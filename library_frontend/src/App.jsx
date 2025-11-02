import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BookOpen, Plus, RefreshCw, Wallet, Check, Clock, AlertCircle } from 'lucide-react';
import './App.css';
import LibraryABI from './abi/mensajeLibrary.json';

const CONTRACT_ADDRESS = "0x1431d20901AecF05A8192498E0A7D635F4ca76ea";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 en decimal

function App() {
  // Estados
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');

  // Función para conectar MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Por favor instala MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      console.log("Cuenta conectada:", accounts[0]);
      setAccount(accounts[0]);

      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      if (chainId !== SEPOLIA_CHAIN_ID) {
        alert('Por favor cambia a la red Sepolia Testnet en MetaMask');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          console.error("Error al cambiar de red:", switchError);
        }
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const libraryContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        LibraryABI,
        signer
      );

      setContract(libraryContract);
      await loadBooks(libraryContract);

    } catch (error) {
      console.error("Error conectando wallet:", error);
      alert("Error al conectar: " + error.message);
    }
  };

  const loadBooks = async (contractInstance) => {
    try {
      setLoading(true);
      console.log("Cargando libros...");
      
      const allBooks = await contractInstance.getAllBooks();
      console.log("Libros obtenidos:", allBooks);

      const formattedBooks = allBooks.map(book => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        year: book.year.toString(),
        onLoan: book.onLoan,
        registeredBy: book.registeredBy
      }));

      setBooks(formattedBooks);
      console.log("Libros formateados:", formattedBooks);

    } catch (error) {
      console.error("Error cargando libros:", error);
      alert("Error al cargar libros: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerBook = async (e) => {
    e.preventDefault();

    if (!contract) {
      alert('Por favor conecta tu wallet primero');
      return;
    }

    if (!title || !author || !publisher || !year) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      console.log("Registrando libro:", { title, author, publisher, year });

      const tx = await contract.registerBook(
        title,
        author,
        publisher,
        parseInt(year)
      );

      console.log("Transacción enviada:", tx.hash);
      alert('Transacción enviada! Esperando confirmación...');

      await tx.wait();
      
      alert('¡Libro registrado exitosamente!');
      console.log("Libro registrado con éxito");

      setTitle('');
      setAuthor('');
      setPublisher('');
      setYear('');

      await loadBooks(contract);

    } catch (error) {
      console.error("Error registrando libro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLoanStatus = async (bookId) => {
    if (!contract) return;

    try {
      setLoading(true);
      console.log("Cambiando estado del libro ID:", bookId);

      const tx = await contract.toggleLoanStatus(bookId);
      console.log("Transacción enviada:", tx.hash);
      alert('Cambiando estado... Esperando confirmación...');

      await tx.wait();
      
      alert('¡Estado actualizado exitosamente!');
      console.log("Estado cambiado con éxito");

      await loadBooks(contract);

    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log("Cuenta cambiada:", accounts[0]);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          setAccount(null);
          setContract(null);
          setBooks([]);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log("Red cambiada:", chainId);
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="header-title">
          <BookOpen size={32} />
          <h1>Biblioteca Descentralizada</h1>
        </div>
        
        {!account ? (
          <button onClick={connectWallet} className="btn-connect">
            <Wallet size={20} />
            Conectar Wallet
          </button>
        ) : (
          <div className="account-info">
            <span className="account-label">Conectado:</span>
            <span className="account-address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        )}
      </header>

      <main className="main-content">
        {!account ? (
          <div className="welcome">
            <BookOpen size={64} />
            <h2>Bienvenido</h2>
            <p>Conecta tu wallet MetaMask para comenzar</p>
            <div className="network-info">
              <AlertCircle size={16} />
              Red requerida: Sepolia Testnet
            </div>
          </div>
        ) : (
          <>
            <section className="register-section">
              <h2>
                <Plus size={24} />
                Registrar Nuevo Libro
              </h2>
              
              <form onSubmit={registerBook} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Título:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Cien Años de Soledad"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Autor:</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ej: Gabriel García Márquez"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Editorial:</label>
                    <input
                      type="text"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      placeholder="Ej: Editorial Sudamericana"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Año:</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Ej: 1967"
                      min="1"
                      max="2025"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  <Plus size={20} />
                  {loading ? 'Procesando...' : 'Registrar Libro'}
                </button>
              </form>
            </section>

            <section className="catalog-section">
              <div className="section-header">
                <h2>
                  <BookOpen size={24} />
                  Catálogo de Libros ({books.length})
                </h2>
                <button 
                  onClick={() => loadBooks(contract)} 
                  className="btn-refresh"
                  disabled={loading}
                >
                  <RefreshCw size={20} />
                  Actualizar
                </button>
              </div>

              {loading && books.length === 0 ? (
                <p className="loading-message">Cargando libros...</p>
              ) : books.length === 0 ? (
                <p className="no-books">No hay libros registrados aún</p>
              ) : (
                <div className="books-grid">
                  {books.map((book) => (
                    <div key={book.id} className="book-card">
                      <div className="book-header">
                        <h3>{book.title}</h3>
                        <span className={`badge ${book.onLoan ? 'on-loan' : 'available'}`}>
                          {book.onLoan ? (
                            <>
                              <Clock size={14} />
                              En Préstamo
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              Disponible
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div className="book-details">
                        <p><strong>Autor:</strong> {book.author}</p>
                        <p><strong>Editorial:</strong> {book.publisher}</p>
                        <p><strong>Año:</strong> {book.year}</p>
                        <p className="book-id"><strong>ID:</strong> {book.id}</p>
                      </div>

                      <button
                        onClick={() => toggleLoanStatus(book.id)}
                        className={`btn-toggle ${book.onLoan ? 'return' : 'loan'}`}
                        disabled={loading}
                      >
                        {book.onLoan ? 'Marcar como Disponible' : 'Marcar como Prestado'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Mini Biblioteca Descentralizada - Bootcamp de Blockchain - 2025</p>
        {CONTRACT_ADDRESS !== "TU_DIRECCION_DEL_CONTRATO_AQUI" && (
          <p className="contract-address">
            Contrato: <code>{CONTRACT_ADDRESS}</code>
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;