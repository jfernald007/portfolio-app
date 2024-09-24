import React, { useState } from 'react';
import { Stack, Text, Group, ActionIcon, Menu } from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconX,
    IconDotsVertical,
} from '@tabler/icons-react';
import SlideForm from './SlideForm';
import CustomDialog from './CustomDialog';

// Define types for the slide and collection
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

interface SlidesProps {
    activeCollection: Collection | null;
    updateCollection: (updatedCollection: Collection) => Promise<void>; // Ensure it's async
    onSelectSlide: (slide: Slide) => void;
    activeSlide: Slide | null;
}

const Slides: React.FC<SlidesProps> = ({
    activeCollection,
    updateCollection,
    onSelectSlide,
    activeSlide,
}) => {
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null); // Track the slide being edited
    const [showDialog, setShowDialog] = useState(false); // Control for showing the form dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Control for delete confirmation dialog
    const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null); // Track the slide to delete
    const [dialogTitle, setDialogTitle] = useState(''); // Title for the dialog

    // Function to handle slide creation or update
    const handleSlideSubmit = async (slideData: Partial<Slide>) => {
        if (!activeCollection) return;

        if (!slideData.title || !slideData.content) {
            console.error('Title and content are required');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5001/api/collections/${activeCollection._id}/slides`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: slideData.title,
                        content: slideData.content,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create slide');
            }

            const updatedCollection = await response.json();

            // After the slide is successfully created and returned, update the state
            await updateCollection(updatedCollection);
            setShowDialog(false);
        } catch (error) {
            console.error('Error creating slide:', error);
        }
    };

    // Function to duplicate a slide using the backend
    const duplicateSlide = async (slide: Slide) => {
        if (!activeCollection) return;

        try {
            const response = await fetch(
                `http://localhost:5001/api/collections/${activeCollection._id}/slides`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: `${slide.title} (Copy)`,
                        content: slide.content,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to duplicate slide');
            }

            const updatedCollection = await response.json();

            // Update the frontend state with the duplicated slide
            await updateCollection(updatedCollection);
        } catch (error) {
            console.error('Error duplicating slide:', error);
        }
    };

    const openSlideDialog = (slide: Slide | null = null) => {
        setEditingSlide(slide);
        setDialogTitle(slide ? 'Edit Slide' : 'Create Slide');
        setShowDialog(true);
    };

    const openDeleteDialog = (slide: Slide) => {
        setSlideToDelete(slide);
        setShowDeleteDialog(true);
    };

    const handleDeleteSlide = async () => {
        if (!activeCollection || !slideToDelete) return;

        try {
            // Make a DELETE request to the backend to remove the slide
            const response = await fetch(
                `http://localhost:5001/api/collections/${activeCollection._id}/slides/${slideToDelete._id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete slide');
            }

            const updatedCollection = await response.json();

            // Update the frontend state with the updated collection
            await updateCollection(updatedCollection);
            setShowDeleteDialog(false);
            setSlideToDelete(null);
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    return (
        <Stack gap={5}>
            {activeCollection ? (
                <>
                    <Group w={300} gap={7} preventGrowOverflow>
                        <Text truncate size="lg" w={'calc(100% - 35px)'}>
                            Slides for {activeCollection.title}
                        </Text>
                        <ActionIcon
                            variant="transparent"
                            aria-label="Settings"
                            onClick={() => openSlideDialog()}
                        >
                            <IconPlus
                                style={{
                                    width: '90%',
                                    height: '90%',
                                }}
                                stroke={1}
                            />
                        </ActionIcon>
                    </Group>

                    {/* List of slides */}
                    {activeCollection.slides.length > 0 ? (
                        activeCollection.slides.map((slide) => (
                            <Group
                                pr={5}
                                w={300}
                                gap={9}
                                preventGrowOverflow
                                key={slide._id}
                                onClick={() => onSelectSlide(slide)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    background:
                                        slide === activeSlide
                                            ? '#f7f7f7'
                                            : 'transparent',
                                }}
                            >
                                <Text
                                    pt={4}
                                    pl={10}
                                    pb={4}
                                    pr={5}
                                    truncate
                                    w={'calc(100% - 70px)'}
                                >
                                    {slide.title}
                                </Text>
                                <Menu
                                    withinPortal
                                    position="bottom-end"
                                    shadow="sm"
                                >
                                    <Menu.Target>
                                        <ActionIcon>
                                            <IconDotsVertical size={16} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() =>
                                                openSlideDialog(slide)
                                            }
                                        >
                                            <Group>
                                                <IconEdit size={16} />
                                                <Text>Edit</Text>
                                            </Group>
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() =>
                                                duplicateSlide(slide)
                                            }
                                        >
                                            <Group>
                                                <IconEdit size={16} />
                                                <Text>Duplicate</Text>
                                            </Group>
                                        </Menu.Item>
                                        <Menu.Item
                                            color="red"
                                            onClick={() =>
                                                openDeleteDialog(slide)
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
                        ))
                    ) : (
                        <Text>No slides added yet.</Text>
                    )}

                    <CustomDialog
                        opened={showDialog}
                        title={dialogTitle}
                        content={
                            <SlideForm
                                initialValues={editingSlide || {}}
                                onSubmit={handleSlideSubmit}
                                onCancel={() => setShowDialog(false)}
                            />
                        }
                        onCancel={() => setShowDialog(false)}
                        showButtons={false}
                    />

                    {slideToDelete && (
                        <CustomDialog
                            opened={showDeleteDialog}
                            title="Delete Slide"
                            content={
                                <Text>
                                    Are you sure you want to delete the slide "
                                    {slideToDelete.title}"?
                                </Text>
                            }
                            onConfirm={handleDeleteSlide}
                            onCancel={() => setShowDeleteDialog(false)}
                            confirmLabel="Delete"
                            cancelLabel="Cancel"
                            showButtons={true}
                        />
                    )}
                </>
            ) : (
                <Group w={300} gap={7} preventGrowOverflow>
                    <Text truncate fw={600} size="lg" w={'calc(100% - 35px)'}>
                        Select a collection to view and add slides
                    </Text>
                </Group>
            )}
        </Stack>
    );
};

export default Slides;
