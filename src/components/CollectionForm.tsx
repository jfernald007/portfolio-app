import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';

interface CollectionFormProps {
    initialValues: {
        _id?: string;
        title: string;
        description: string;
    };
    onSubmit: (collectionData: {
        _id?: string;
        title: string;
        description: string;
        slides: any[]; // Include slides in the form data
    }) => void;
    onCancel: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
    initialValues = { title: '', description: '' },
    onSubmit,
    onCancel,
}) => {
    const [title, setTitle] = useState(initialValues.title || '');
    const [description, setDescription] = useState(
        initialValues.description || ''
    );
    const [isChanged, setIsChanged] = useState(false);

    // Check if the form fields are different from the initial values (for editing)
    useEffect(() => {
        const isFormChanged =
            title !== initialValues.title ||
            description !== initialValues.description;
        setIsChanged(isFormChanged);
    }, [title, description, initialValues]);

    // Ensure isSaveDisabled is boolean
    const isSaveDisabled: boolean =
        title.trim() === '' ||
        description.trim() === '' ||
        (!isChanged && Boolean(initialValues.title));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSaveDisabled) {
            onSubmit({
                _id: initialValues._id,
                title,
                description,
                slides: [],
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    label="Collection Title"
                    placeholder="Enter collection title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    label="Collection Description"
                    placeholder="Enter a brief description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

export default CollectionForm;
