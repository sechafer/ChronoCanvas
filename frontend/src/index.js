import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom-bootstrap.scss';
import 'react-datepicker/dist/react-datepicker.css';
const express = require('express'); // Si usas Express
const app = express();

const port = process.env.PORT || 3000; // Obtiene el puerto del entorno o usa 3000 como fallback
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

