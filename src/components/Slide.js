import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Stack, TextInput, Button, Box } from '@mantine/core';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const Slide = ({ onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
        onSave({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <Box p={0} align="flex-start">
            <Stack px={0} py={10} w={300} gap={5}>
                <TextInput
                    label="Slide Title"
                    placeholder="Slide Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <ReactQuill value={content} onChange={setContent} />
                <Button onClick={handleSave}>Save Slide</Button>
            </Stack>
        </Box>
    );
};

export default Slide;
