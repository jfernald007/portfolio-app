import React from 'react';
import { Stack, Title, Text, Button, Box } from '@mantine/core';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Dashboard = () => {
    return (
        <Box p={20} align="flex-start">
            <Stack p={10} w={300} gap={5}>
                <Title order={1}>Dashboard</Title>
                <Text>
                    Welcome to your portfolio dashboard! Here you can create,
                    edit, and manage your portfolios.
                </Text>

                {/* Placeholder for future components like portfolio creation tools */}
                <Title order={2} mt="xl">
                    Your Portfolios
                </Title>
                <Text>No portfolios yet. Start by creating one!</Text>

                {/* Add a button to create a new portfolio */}
                <Button mt="md" variant="outline">
                    Create New Portfolio
                </Button>
                <Button component={Link} to="/" mt="md" variant="outline">
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
};

export default Dashboard;
