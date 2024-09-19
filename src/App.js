import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Stack, Title, Button, Text, Box } from '@mantine/core';
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function Home() {
    return (
        <Box p={20} align="flex-start">
            <Stack p={10} w={300} gap={5}>
                <Title order={1}>Home Page</Title>
                <Text>Welcome to the portfolio app!</Text>
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
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
