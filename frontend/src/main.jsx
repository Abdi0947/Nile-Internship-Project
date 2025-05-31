import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Import your styles
import App from './App.jsx'; // Make sure App is still a .jsx file if you use JSX in it
import store from './store/store.js'; // Assuming you have a Redux store
import { Provider } from 'react-redux';
import { initSessionPersistence } from './lib/sessionPersistence';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from 'react-hot-toast';

// Initialize session persistence
initSessionPersistence();

// AppWrapper component to handle global side effects
const AppWrapper = () => {
  useEffect(() => {
    // Log startup information
    console.log('Application initialized');
    
    // Clean up on unmount
    return () => {
      console.log('Application cleanup');
    };
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId="438049168106-s8iocmapck9alne527skbbofc5tligcl.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
      <Toaster position="top-right" />
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </StrictMode>
);
