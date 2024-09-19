import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Title, Button, Text } from '@mantine/core';
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function Home() {
  return (
    <Container>
      <Title order={1}>Home Page</Title>
      <Text>Welcome to the portfolio app!</Text>
      {/* Add a Button that links to the Dashboard */}
      <Button component={Link} to="/dashboard" mt="md" variant="outline">
        Go to Dashboard
      </Button>
    </Container>
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
