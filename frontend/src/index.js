import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/Common/ToastProvider';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Main entry point
// Sets up providers and renders App

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function Fallback() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Something went wrong.</h2>
      <p>
        Our team has been notified. Please refresh the page or try again later.
      </p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Sentry.ErrorBoundary fallback={<Fallback />}>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </I18nextProvider>
  </Sentry.ErrorBoundary>
);
