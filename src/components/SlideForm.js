import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';

const SlideForm = ({ initialValues = {}, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialValues.title || '');
    const [content, setContent] = useState(initialValues.content || '');
    const [isChanged, setIsChanged] = useState(false);

    // Check if the form has changed compared to initial values
    useEffect(() => {
        const hasChanged =
            title !== initialValues.title || content !== initialValues.content;
        setIsChanged(hasChanged);
    }, [title, content, initialValues]);

    // Disable the save button if no changes or fields are empty
    const isSaveDisabled =
        title.trim() === '' || content.trim() === '' || !isChanged;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isSaveDisabled) {
            onSubmit({ _id: initialValues._id, title, content });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="md">
                <TextInput
                    label="Slide Title"
                    placeholder="Enter slide title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    label="Slide Content"
                    placeholder="Enter slide content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <Group position="right" mt="md">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSaveDisabled}>
                        Save
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default SlideForm;
