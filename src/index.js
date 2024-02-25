import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { registerSW } from "./pwa.js";

registerSW();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
