import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Your global CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';  // Import your App component

// Main entry point
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      {/* ToastContainer is now globally available */}
      <ToastContainer position="top-right" autoClose={3000} />
      <App /> {/* Your App component */}
    </Router>
  </React.StrictMode>
);
