import React, { useState, useEffect } from 'react';
import { Stack, Title, Text, Button, Box } from '@mantine/core';
import { Link } from 'react-router-dom'; // Import Link from React Router
import axios from 'axios';
import CollectionForm from './CollectionForm';

const Dashboard = () => {
    const [collections, setCollections] = useState([]);

    // Fetch collections from the backend
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/collections'
                );
                setCollections(response.data);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        fetchCollections();
    }, []);

    // Handle collection submission
    const handleCollectionSubmit = async (newCollection) => {
        try {
            const response = await axios.post(
                'http://localhost:5001/collections',
                newCollection
            );
            console.log('Response from API:', response.data); // Add this line
            setCollections((prevCollections) => [
                ...prevCollections,
                response.data,
            ]);
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    };

    return (
        <Box p={20} align="flex-start">
            <Stack p={10} w={300} gap={5}>
                <Title order={1}>Dashboard</Title>
                <Text>
                    Welcome to your collection dashboard! Here you can create,
                    edit, and manage your collections.
                </Text>

                <CollectionForm onSubmit={handleCollectionSubmit} />

                <Title order={2} mt="xl">
                    Your Collections
                </Title>
                {collections.length > 0 ? (
                    collections.map((collection, index) => (
                        <div key={index}>
                            <Title order={3}>{collection.title}</Title>
                            <Text>{collection.description}</Text>
                        </div>
                    ))
                ) : (
                    <Text>No collections yet. Start by creating one!</Text>
                )}
                <Button component={Link} to="/" mt="md" variant="outline">
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
};

export default Dashboard;
