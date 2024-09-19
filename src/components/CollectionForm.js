import React, { useState } from 'react';
import { Stack, TextInput, Textarea, Button, Box } from '@mantine/core';
import Slide from './Slide';

const PortfolioForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slides, setSlides] = useState([]);

    const addSlide = (newSlide) => {
        setSlides([...slides, newSlide]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, slides });
        setTitle('');
        setDescription('');
        setSlides([]); // Reset slides after submission
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

                    {/* Slide creation */}
                    <h3>Add Slides</h3>
                    {slides.map((slide, index) => (
                        <div key={index}>
                            <h4>{slide.title}</h4>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: slide.content,
                                }}
                            />
                        </div>
                    ))}
                    <Slide onSave={addSlide} />

                    <Button type="submit">Create Portfolio</Button>
                </form>
            </Stack>
        </Box>
    );
};

export default PortfolioForm;
