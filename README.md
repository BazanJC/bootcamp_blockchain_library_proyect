# 📚 Mini Biblioteca Descentralizada (dApp)

## 👨‍💻 Autor
**Juan Carlos Bazán Panozo**
Bootcamp de Blockchain 2025

---

## 🎯 Descripción del Proyecto

Mini Biblioteca Descentralizada es una aplicación descentralizada (**dApp**) construida sobre la blockchain de Ethereum que permite la gestión transparente e inmutable de un catálogo de libros.

Este proyecto demuestra la implementación práctica de conceptos fundamentales de **Web3**, incluyendo:
* 📝 **Smart Contracts** escritos en Solidity.
* 🔗 Interacción con blockchain mediante **Ethers.js**.
* 🦊 Integración con **MetaMask** para autenticación Web3.
* ⚡ **Transacciones *on-chain*** para registro y actualización de datos.
* 🎨 **Frontend React** (Vite).

### ✨ Características

| Componente | Característica |
| :--- | :--- |
| **Smart Contract** | 📚 **Registro de Libros:** Almacenamiento de Título, Autor, Editorial, Año. |
| **Smart Contract** | 📤 **Gestión de Préstamos:** Función para cambiar el estado entre "Disponible" y "En Préstamo". |
| **Smart Contract** | 🔢 **Sistema de IDs Único:** IDs automáticos para cada libro. |
| **Smart Contract** | 🔔 **Eventos:** Emisión de eventos para *tracking* (`BookAdded`, `LoanStatusChanged`). |
| **Frontend** | 🦊 **Conexión con MetaMask:** Autenticación Web3 *seamless*. |
| **Frontend** | 📋 **Catálogo Visual:** Visualización de la lista de libros en *cards*. |
| **Frontend** | 🔄 **Actualización en Tiempo Real:** Recarga automática tras transacciones exitosas. |
| **Frontend** | 🌐 **Detección de Red y Cuenta:** Manejo de cambios de cuenta y red en MetaMask. |

---

## 🛠️ Tecnologías Utilizadas

| Componente | Herramienta | Versión |
| :--- | :--- | :--- |
| **Blockchain** | **Solidity** (Smart Contracts) | `^0.8.30` |
| **Desarrollo** | **Remix** (Compilación y Despliegue) | Última |
| **Frontend** | **React** (Vite) | Última |
| **Web3** | **Ethers.js** | `^6.x` |
| **Red de Pruebas** | **Base Sepolia Testnet** | - |

---

## 🔗 Datos del Despliegue

**⚠️ IMPORTANTE:** Por favor, actualiza la información del contrato una vez que hayas desplegado y verificado.

| Recurso | URL/Address |
| :--- | :--- |
| **🌐 Aplicación Web (Vercel)** | [https://bootcamp-blockchain-library-proyect.vercel.app](https://bootcamp-blockchain-library-proyect.vercel.app) |
| **Red de Despliegue** | Base Sepolia Testnet |
| **Contrato Address** | 0x1431d20901AecF05A8192498E0A7D635F4ca76ea|

---

## 🚀 Guía de Ejecución

### Ejecución del Frontend (React/Vite)

1.  Actualiza `frontend/src/utils/contract.js` con el **ABI** (de `out/Library.sol/Library.json`) y el **Address** del paso anterior.
2.  Navega a la carpeta del frontend e instala dependencias:
    ```bash
    cd frontend
    npm install
    ```
3.  Inicia la aplicación localmente:
    ```bash
    npm run dev
    ```
4.  O accede directamente a la **URL de Vercel** (asegúrate de que tu MetaMask esté en la red Base Sepolia).

---
