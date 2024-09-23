import React, { useState, useEffect } from 'react';
import { Stack, Text, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconEdit, IconX } from '@tabler/icons-react';
import CollectionForm from './CollectionForm';
import CustomDialog from './CustomDialog';
import axios from 'axios';

// Define types for Slide and Collection
interface Slide {
    _id: string;
    title: string;
    content: string;
}

interface Collection {
    _id: string;
    title: string; // Ensure title is always a string
    description: string; // Ensure description is always a string
    slides: Slide[];
}

interface CollectionsProps {
    onSelectCollection: (collection: Collection | null) => void; // Allow null for deselecting collections
    activeCollection: Collection | null;
}

const Collections: React.FC<CollectionsProps> = ({
    onSelectCollection,
    activeCollection,
}) => {
    const [collections, setCollections] = useState<Collection[]>([]); // Collection list
    const [editingCollection, setEditingCollection] =
        useState<Collection | null>(null); // For editing
    const [showDialog, setShowDialog] = useState(false); // Control for showing/hiding the dialog
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
        null
    ); // Content for dialog
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
    const updateCollection = async (updatedCollection: Collection) => {
        try {
            const response = await axios.put(
                `http://localhost:5001/collections/${updatedCollection._id}`,
                updatedCollection
            );

            setCollections((prevCollections) =>
                prevCollections.map((col) =>
                    col._id === updatedCollection._id ? response.data : col
                )
            );
        } catch (error) {
            console.error('Error updating collection:', error);
        }
    };

    // Handle creating or updating a collection
    const handleCollectionSubmit = async (collectionData: {
        _id?: string;
        title: string;
        description: string;
        slides: any[];
    }) => {
        try {
            // Add a fallback for _id if it's undefined (for new collections)
            if (collectionData._id) {
                // If _id is present, update the collection (PUT request)
                const response = await axios.put(
                    `http://localhost:5001/collections/${collectionData._id}`,
                    collectionData
                );
                const updatedCollection = response.data;

                // Update the existing collection in the state
                setCollections((prevCollections) =>
                    prevCollections.map((col) =>
                        col._id === updatedCollection._id
                            ? updatedCollection
                            : col
                    )
                );
            } else {
                // If no _id, create a new collection (POST request)
                const response = await axios.post(
                    'http://localhost:5001/collections',
                    collectionData
                );
                setCollections((prevCollections) => [
                    ...prevCollections,
                    response.data,
                ]);
            }

            setShowDialog(false); // Close the dialog after submit
            setEditingCollection(null); // Reset editing state
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    };

    // Handle delete action
    const handleDeleteCollection = async (collectionId: string) => {
        try {
            await axios.delete(
                `http://localhost:5001/collections/${collectionId}`
            );
            setCollections((prevCollections) =>
                prevCollections.filter((col) => col._id !== collectionId)
            );
            setShowDialog(false); // Close the dialog after deletion
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    // Open the dialog for creating/editing collections
    const openCreateEditDialog = (collection: Collection | null = null) => {
        const initialValues = collection
            ? {
                  ...collection,
                  description: collection.description || '',
                  slides: collection.slides || [],
              }
            : { title: '', description: '', slides: [] }; // Default values for new collection

        setEditingCollection(collection); // Set the collection to edit (or null for new)
        setDialogTitle(collection ? 'Edit Collection' : 'Create Collection'); // Set the title
        setDialogContent(
            <CollectionForm
                initialValues={initialValues} // Pass the prepared initial values
                onSubmit={handleCollectionSubmit}
                onCancel={() => setShowDialog(false)}
            />
        ); // Set the form as the content
        setShowButtons(false); // Disable the dialog buttons for form submission
        setShowDialog(true); // Open the dialog
    };

    // Open the dialog for deleting a collection
    const openDeleteDialog = (collection: Collection) => {
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
        <Stack gap={5}>
            <Group w={300} gap={7} preventGrowOverflow>
                <Text truncate fw={600} size="lg" w={'calc(100% - 35px)'}>
                    Collections
                </Text>
                <ActionIcon
                    variant="transparent"
                    aria-label="Add"
                    onClick={() => openCreateEditDialog()}
                >
                    <IconPlus
                        style={{ width: '90%', height: '90%' }}
                        stroke={1}
                    />
                </ActionIcon>
            </Group>

            {collections.length > 0 ? (
                collections.map((collection) => (
                    <Group
                        pr={5}
                        w={300}
                        gap={9}
                        preventGrowOverflow
                        key={collection._id}
                        className={`collectionGroup ${
                            collection._id === activeCollection?._id
                                ? 'active'
                                : ''
                        }`}
                    >
                        <Text
                            pt={4}
                            pl={10}
                            pb={4}
                            pr={5}
                            truncate
                            w={'calc(100% - 70px)'}
                            onClick={() => onSelectCollection(collection)}
                            style={{
                                cursor: 'pointer',
                                color:
                                    collection._id === activeCollection?._id
                                        ? 'indigo'
                                        : '#000',
                            }}
                        >
                            {collection.title}
                        </Text>
                        <Group pt={1} gap={5}>
                            <ActionIcon
                                color="gray"
                                variant="transparent"
                                aria-label="Edit"
                                onClick={() => openCreateEditDialog(collection)}
                            >
                                <IconEdit
                                    style={{ width: '90%', height: '90%' }}
                                    stroke={1}
                                />
                            </ActionIcon>
                            <ActionIcon
                                color="gray"
                                variant="transparent"
                                aria-label="Delete"
                                onClick={() => openDeleteDialog(collection)}
                            >
                                <IconX
                                    style={{ width: '90%', height: '90%' }}
                                    stroke={1}
                                />
                            </ActionIcon>
                        </Group>
                    </Group>
                ))
            ) : (
                <Text>No collections yet.</Text>
            )}

            <CustomDialog
                opened={showDialog}
                title={dialogTitle}
                content={dialogContent}
                onConfirm={() =>
                    handleDeleteCollection(editingCollection?._id ?? '')
                }
                onCancel={() => setShowDialog(false)}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                showButtons={showButtons}
            />
        </Stack>
    );
};

export default Collections;
