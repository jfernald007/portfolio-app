import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Stack, Group } from '@mantine/core';

const CollectionForm = ({ initialValues = {}, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialValues.title || '');
    const [description, setDescription] = useState(
        initialValues.description || ''
    );
    const [isChanged, setIsChanged] = useState(false); // Track if any changes have been made

    // Check if the form fields are different from the initial values (for editing)
    useEffect(() => {
        if (initialValues.title || initialValues.description) {
            const isFormChanged =
                title !== initialValues.title ||
                description !== initialValues.description;
            setIsChanged(isFormChanged);
        }
    }, [title, description, initialValues]);

    // Disable the save button if required fields are not filled
    const isSaveDisabled =
        title.trim() === '' ||
        description.trim() === '' ||
        (!isChanged && initialValues.title);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isSaveDisabled) {
            // Pass the _id when editing a collection
            onSubmit({ _id: initialValues._id, title, description });
        }
    };

    const handleCancel = () => {
        setTitle(initialValues.title || ''); // Reset the title field
        setDescription(initialValues.description || ''); // Reset the description field
        onCancel(); // Trigger the cancel action to close the form
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="md">
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

                <Group position="right" mt="md">
                    <Button variant="outline" onClick={handleCancel}>
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
