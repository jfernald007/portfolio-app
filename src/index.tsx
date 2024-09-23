import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Ensure Mantine core styles are imported
import './index.css'; // Your custom CSS (or you can use SCSS)
import App from './App';

// Get the root element and ensure it's not null
const rootElement = document.getElementById('root');

// Check if the rootElement exists before rendering
if (rootElement) {
    // Create the root using createRoot
    const root = ReactDOM.createRoot(rootElement as HTMLElement); // Type assertion to ensure TypeScript knows it's an HTML element

    // Render the app
    root.render(
        <MantineProvider>
            <App />
        </MantineProvider>
    );
} else {
    console.error('Root element not found');
}
