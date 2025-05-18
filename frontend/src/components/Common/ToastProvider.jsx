import React from 'react';
import { SnackbarProvider } from 'notistack';

// Toast/snackbar provider for notifications
export default function ToastProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3500}
      preventDuplicate
    >
      {children}
    </SnackbarProvider>
  );
}
