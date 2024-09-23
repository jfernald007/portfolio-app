import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';

// Define the type for the form's initial values
interface SlideFormProps {
    initialValues: {
        _id?: string;
        title?: string;
        content?: string;
    };
    onSubmit: (slideData: {
        _id?: string;
        title: string;
        content: string;
    }) => void;
    onCancel: () => void;
}

const SlideForm: React.FC<SlideFormProps> = ({
    initialValues = {},
    onSubmit,
    onCancel,
}) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSaveDisabled) {
            onSubmit({ _id: initialValues._id, title, content });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
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
                <Group mt="md">
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
