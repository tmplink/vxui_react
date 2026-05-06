import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, ToastProvider } from './lib';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider storageKey="vxui-react-docs-theme">
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
