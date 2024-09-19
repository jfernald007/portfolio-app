import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './index.css';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Create the root using createRoot
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
    </MantineProvider>
);
