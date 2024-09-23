import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Stack, Title, Button, Text, Box } from '@mantine/core';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import { ThemeProvider } from './ThemeProvider'; // Import the ThemeProvider
import './styles/global.scss';

// Define the Home component with TypeScript
const Home: FC = () => {
    return (
        <Box p={20}>
            <Stack p={10} w={300} gap={5}>
                <Title order={1}>Home Page</Title>
                <Text>Welcome to the collection app!</Text>
                {/* Add a Button that links to the Dashboard */}
                <Button
                    component={Link}
                    to="/dashboard"
                    mt="md"
                    variant="outline"
                >
                    Go to Dashboard
                </Button>
            </Stack>
        </Box>
    );
};

// Define the App component with TypeScript
const App: FC = () => {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
