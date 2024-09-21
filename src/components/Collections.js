import React, { useState, useEffect } from 'react';
import { Stack, Text, Button, Group } from '@mantine/core';
import CollectionForm from './CollectionForm';
import CustomDialog from './CustomDialog'; // Import the reusable dialog
import axios from 'axios';

const Collections = ({ onSelectCollection, activeCollection }) => {
    const [collections, setCollections] = useState([]); // Collection list
    const [editingCollection, setEditingCollection] = useState(null); // For editing
    const [showDialog, setShowDialog] = useState(false); // For showing/hiding the dialog
    const [dialogContent, setDialogContent] = useState(null); // Content for dialog
    const [dialogTitle, setDialogTitle] = useState(''); // Title for the dialog
    const [showButtons, setShowButtons] = useState(false); // Control dialog buttons for confirmation

    // Fetch collections from the backend when the component mounts
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/collections'
                );
                setCollections(response.data); // Set the fetched collections
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        fetchCollections();
    }, []);

    // Function to update a collection (e.g., adding, editing, or deleting slides)
    const updateCollection = async (updatedCollection) => {
        try {
            console.log(
                'Sending updated collection to backend:',
                updatedCollection
            ); // Debugging

            const response = await axios.put(
                `http://localhost:5001/collections/${updatedCollection._id}`,
                updatedCollection
            );

            console.log('Backend response:', response.data); // Check the backend response

            // Update the state after saving
            setCollections((prevCollections) =>
                prevCollections.map((col) =>
                    col._id === updatedCollection._id ? response.data : col
                )
            );
        } catch (error) {
            console.error(
                'Error updating collection:',
                error.response || error.message
            );
        }
    };

    // Handle creating or updating a collection
    const handleCollectionSubmit = async (collectionData) => {
        try {
            if (collectionData._id) {
                // If _id is present, update the collection (PUT request)
                const response = await axios.put(
                    `http://localhost:5001/collections/${collectionData._id}`,
                    collectionData
                );
                const updatedCollection = response.data;

                // Update the existing collection in the state
                const updatedCollections = collections.map((col) =>
                    col._id === updatedCollection._id ? updatedCollection : col
                );
                setCollections(updatedCollections);
            } else {
                // If no _id, create a new collection (POST request)
                const response = await axios.post(
                    'http://localhost:5001/collections',
                    collectionData
                );
                setCollections([...collections, response.data]); // Add the new collection
            }

            setShowDialog(false); // Close the dialog after submit
            setEditingCollection(null); // Reset editing state
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    };

    // Handle delete action
    const handleDeleteCollection = async (collectionId) => {
        try {
            await axios.delete(
                `http://localhost:5001/collections/${collectionId}`
            );
            setCollections(
                collections.filter((col) => col._id !== collectionId)
            ); // Remove the collection
            setShowDialog(false); // Close the dialog after deletion
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    // Open the dialog for creating/editing collections
    const openCreateEditDialog = (collection = null) => {
        setEditingCollection(collection); // Set the collection to edit (or null for new)
        setDialogTitle(collection ? 'Edit Collection' : 'Create Collection'); // Set the title
        setDialogContent(
            <CollectionForm
                initialValues={collection || {}}
                onSubmit={handleCollectionSubmit}
                onCancel={() => setShowDialog(false)}
            />
        ); // Set the form as the content
        setShowButtons(false); // Disable the dialog buttons for form submission
        setShowDialog(true); // Open the dialog
    };

    // Open the dialog for deleting a collection
    const openDeleteDialog = (collection) => {
        setEditingCollection(collection); // Set the collection to delete
        setDialogTitle('Delete Collection'); // Set the title
        setDialogContent(
            <Text>
                Are you sure you want to delete the collection "
                {collection.title}"?
            </Text>
        ); // Set the confirmation message
        setShowButtons(true); // Enable the dialog buttons for confirmation
        setShowDialog(true); // Open the dialog
    };

    return (
        <Stack>
            {/* Title and Create Button aligned */}
            <Group position="apart">
                <Text weight={600} size="lg">
                    Collections
                </Text>
                <Button onClick={() => openCreateEditDialog()}>
                    Create Collection
                </Button>
            </Group>

            {collections.length > 0 ? (
                collections.map((collection) => (
                    <Group key={collection._id} position="apart">
                        <Text
                            onClick={() => onSelectCollection(collection)} // Set active collection
                            style={{
                                cursor: 'pointer',
                                color:
                                    collection === activeCollection
                                        ? 'blue'
                                        : 'black',
                            }}
                        >
                            {collection.title}
                        </Text>
                        <Group>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => openCreateEditDialog(collection)} // Open the create/edit dialog
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                color="red"
                                onClick={() => openDeleteDialog(collection)} // Open the delete dialog
                            >
                                Delete
                            </Button>
                        </Group>
                    </Group>
                ))
            ) : (
                <Text>No collections yet.</Text>
            )}

            {/* Reusable Custom Dialog */}
            <CustomDialog
                opened={showDialog}
                title={dialogTitle}
                content={dialogContent}
                onConfirm={() => handleDeleteCollection(editingCollection._id)}
                onCancel={() => setShowDialog(false)}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                showButtons={showButtons} // Show buttons only for confirmation actions
            />
        </Stack>
    );
};

export default Collections;
