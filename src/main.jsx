
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import Privacidade from './pages/Privacidade.jsx';

import './index.css';

const caminho = window.location.pathname.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {caminho === '/privacidade' ? <Privacidade /> : <App />}
  </StrictMode>
);