import React, { useState, useEffect } from 'react';
import { Stack, Text, Group, ActionIcon, Menu } from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconX,
    IconDotsVertical,
} from '@tabler/icons-react';
import CollectionForm from './CollectionForm';
import CustomDialog from './CustomDialog';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Define types for Slide and Collection
interface Slide {
    _id: string;
    title: string;
    content: string;
}

interface Collection {
    _id: string;
    title: string;
    description: string;
    slides: Slide[];
}

interface CollectionsProps {
    collections: Collection[];
    onSelectCollection: (collection: Collection | null) => void;
    activeCollection: Collection | null;
}

const Collections: React.FC<CollectionsProps> = ({
    collections,
    onSelectCollection,
    activeCollection,
}) => {
    const [localCollections, setLocalCollections] =
        useState<Collection[]>(collections); // Local state for collections
    const [editingCollection, setEditingCollection] =
        useState<Collection | null>(null); // For editing
    const [showDialog, setShowDialog] = useState(false); // Control for showing/hiding the dialog
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
        null
    ); // Content for dialog
    const [dialogTitle, setDialogTitle] = useState(''); // Title for the dialog
    const [showButtons, setShowButtons] = useState(false); // Control dialog buttons for confirmation

    useEffect(() => {
        setLocalCollections(collections);
    }, [collections]);

    // Handle the drag and drop event
    const onDragEnd = async (result: any) => {
        const { destination, source } = result;

        // If dropped outside the list, do nothing
        if (!destination) {
            return;
        }

        // Reorder collections array
        const reorderedCollections = Array.from(localCollections);
        const [removed] = reorderedCollections.splice(source.index, 1);
        reorderedCollections.splice(destination.index, 0, removed);

        setLocalCollections(reorderedCollections);

        // Send updated order to the backend
        try {
            await fetch('http://localhost:5001/collections/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reorderedCollections),
            });
        } catch (error) {
            console.error('Error saving new order:', error);
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

    // Handle creating or updating a collection
    const handleCollectionSubmit = async (
        collectionData: Partial<Collection>
    ) => {
        try {
            const currentCollection = localCollections.find(
                (col) => col._id === collectionData._id
            );

            // Create updatedCollectionData and handle _id separately to avoid type issues
            const updatedCollectionData: Partial<Collection> = {
                ...collectionData,
                slides: currentCollection
                    ? currentCollection.slides
                    : collectionData.slides || [],
            };

            if (updatedCollectionData._id) {
                // If _id is present, update the collection (PUT request)
                const response = await axios.put(
                    `http://localhost:5001/collections/${updatedCollectionData._id}`,
                    updatedCollectionData
                );
                const updatedCollection = response.data;

                // Update the existing collection in the list without changing its position
                setLocalCollections((prevCollections) =>
                    prevCollections.map((col) =>
                        col._id === updatedCollection._id
                            ? updatedCollection
                            : col
                    )
                );
            } else {
                // Handle case for creating a new collection (POST request)
                const response = await axios.post(
                    'http://localhost:5001/collections',
                    updatedCollectionData
                );

                // Add the new collection to the top of the list
                setLocalCollections((prevCollections) => [
                    response.data,
                    ...prevCollections,
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
                `http://localhost:5001/api/collections/${collectionId}`
            );

            setLocalCollections((prevCollections) =>
                prevCollections.filter((col) => col._id !== collectionId)
            );
            setShowDialog(false); // Close the dialog after deletion
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="collections-list">
                {(provided) => (
                    <Stack
                        w={'100%'}
                        {...provided.droppableProps}
                        ref={provided.innerRef} // Ensure the innerRef is passed correctly here
                        gap={5}
                    >
                        <Group p={0} w={'100%'} gap={7} preventGrowOverflow>
                            <Text
                                truncate
                                fw={600}
                                size="lg"
                                w={'calc(100% - 35px)'}
                            >
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

                        {localCollections.length > 0 ? (
                            localCollections.map((collection, index) => (
                                <Draggable
                                    key={collection._id}
                                    draggableId={collection._id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Group
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef} // Ensure innerRef is passed here too
                                            gap={9}
                                            preventGrowOverflow
                                            key={collection._id}
                                            className={`collectionCard ${
                                                collection._id ===
                                                activeCollection?._id
                                                    ? 'active'
                                                    : ''
                                            } draggable`}
                                        >
                                            <Text
                                                size={'13px'}
                                                px={10}
                                                py={3}
                                                truncate
                                                w={'calc(100% - 38px)'}
                                                onClick={() =>
                                                    onSelectCollection(
                                                        collection
                                                    )
                                                }
                                            >
                                                {collection.title}
                                            </Text>
                                            <Menu
                                                withinPortal
                                                position="bottom-end"
                                                shadow="sm"
                                            >
                                                <Menu.Target>
                                                    <ActionIcon variant="transparent">
                                                        <IconDotsVertical
                                                            size={16}
                                                        />
                                                    </ActionIcon>
                                                </Menu.Target>

                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        onClick={() =>
                                                            openCreateEditDialog(
                                                                collection
                                                            )
                                                        }
                                                    >
                                                        <Group>
                                                            <IconEdit
                                                                size={16}
                                                            />
                                                            <Text>Edit</Text>
                                                        </Group>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        color="red"
                                                        onClick={() =>
                                                            handleDeleteCollection(
                                                                collection._id
                                                            )
                                                        }
                                                    >
                                                        <Group>
                                                            <IconX size={16} />
                                                            <Text>Delete</Text>
                                                        </Group>
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Group>
                                    )}
                                </Draggable>
                            ))
                        ) : (
                            <Text>No collections yet.</Text>
                        )}

                        <CustomDialog
                            opened={showDialog}
                            title={dialogTitle}
                            content={dialogContent}
                            onConfirm={() =>
                                showDialog &&
                                dialogTitle === 'Delete Collection'
                                    ? handleDeleteCollection(
                                          editingCollection?._id ?? ''
                                      )
                                    : null
                            }
                            onCancel={() => setShowDialog(false)}
                            confirmLabel="Delete"
                            cancelLabel="Cancel"
                            showButtons={showButtons}
                        />
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Collections;
