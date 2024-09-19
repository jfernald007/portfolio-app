import React, { useState } from 'react';
import { Stack, TextInput, Textarea, Button, Group, Box } from '@mantine/core';

const PortfolioForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <Box p={0} align="flex-start">
            <Stack px={0} py={10} w={300} gap={5}>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Portfolio Title"
                        placeholder="Enter portfolio title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Textarea
                        label="Portfolio Description"
                        placeholder="Enter a brief description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        mt="md"
                        required
                    />

                    <Group position="right" mt="md">
                        <Button type="submit">Create Portfolio</Button>
                    </Group>
                </form>
            </Stack>
        </Box>
    );
};

export default PortfolioForm;
