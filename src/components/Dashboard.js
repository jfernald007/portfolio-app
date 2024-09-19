import React, { useState, useEffect } from 'react';
import { Stack, Title, Text, Button, Box } from '@mantine/core';
import { Link } from 'react-router-dom'; // Import Link from React Router
import axios from 'axios';
import PortfolioForm from './PortfolioForm';

const Dashboard = () => {
    const [portfolios, setPortfolios] = useState([]);

    // Fetch portfolios from the backend
    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/portfolios'
                );
                setPortfolios(response.data);
            } catch (error) {
                console.error('Error fetching portfolios:', error);
            }
        };

        fetchPortfolios();
    }, []);

    // Handle portfolio submission
    const handlePortfolioSubmit = async (newPortfolio) => {
        try {
            const response = await axios.post(
                'http://localhost:5001/portfolios',
                newPortfolio
            );
            console.log('Response from API:', response.data); // Add this line
            setPortfolios((prevPortfolios) => [
                ...prevPortfolios,
                response.data,
            ]);
        } catch (error) {
            console.error('Error creating portfolio:', error);
        }
    };

    return (
        <Box p={20} align="flex-start">
            <Stack p={10} w={300} gap={5}>
                <Title order={1}>Dashboard</Title>
                <Text>
                    Welcome to your portfolio dashboard! Here you can create,
                    edit, and manage your portfolios.
                </Text>

                <PortfolioForm onSubmit={handlePortfolioSubmit} />

                <Title order={2} mt="xl">
                    Your Portfolios
                </Title>
                {portfolios.length > 0 ? (
                    portfolios.map((portfolio, index) => (
                        <div key={index}>
                            <Title order={3}>{portfolio.title}</Title>
                            <Text>{portfolio.description}</Text>
                        </div>
                    ))
                ) : (
                    <Text>No portfolios yet. Start by creating one!</Text>
                )}
                <Button component={Link} to="/" mt="md" variant="outline">
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
};

export default Dashboard;
