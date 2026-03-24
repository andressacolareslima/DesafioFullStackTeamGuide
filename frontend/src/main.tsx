import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento 'root'.");
}


(ReactDOM as any).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);