import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/base.css';
import { ThemeProvider, ToastProvider, themePresets, ViewportProvider } from './lib';
import { I18nProvider } from './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <ThemeProvider themes={themePresets} storageKey="vxui-react-docs-theme">
        <ViewportProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ViewportProvider>
      </ThemeProvider>
    </I18nProvider>
  </React.StrictMode>,
);
