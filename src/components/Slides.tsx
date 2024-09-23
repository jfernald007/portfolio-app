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

// Function to generate a unique ID for slides
const generateSlideId = (collectionId: string) => {
    return `${collectionId}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
};

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

        const updatedSlides = editingSlide
            ? activeCollection.slides.map((slide) =>
                  slide._id === editingSlide._id
                      ? { ...slide, ...slideData } // Only update the existing slide
                      : slide
              )
            : [
                  ...activeCollection.slides,
                  {
                      _id: generateSlideId(activeCollection._id), // Only add `_id` for new slides
                      title: slideData.title,
                      content: slideData.content,
                  },
              ];

        const updatedCollection: Collection = {
            ...activeCollection,
            slides: updatedSlides,
        };

        try {
            await updateCollection(updatedCollection); // Await the update operation
            setShowDialog(false); // Close the dialog after success
            setEditingSlide(null); // Reset the editing slide
        } catch (error) {
            console.error('Error updating collection:', error); // Handle errors
        }
    };

    // Function to duplicate a slide
    const duplicateSlide = async (slide: Slide) => {
        if (!activeCollection) return;

        const newSlide = {
            _id: generateSlideId(activeCollection._id), // Generate a new ID for the slide
            title: `${slide.title} (Copy)`,
            content: slide.content,
        };

        const updatedSlides = [...activeCollection.slides, newSlide];

        const updatedCollection = {
            ...activeCollection,
            slides: updatedSlides,
        };

        try {
            await updateCollection(updatedCollection); // Update collection with new slide
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

    const handleDeleteSlide = () => {
        if (!activeCollection || !slideToDelete) return;

        const updatedSlides = activeCollection.slides.filter(
            (slide) => slide._id !== slideToDelete._id
        );

        const updatedCollection = {
            ...activeCollection,
            slides: updatedSlides,
        };

        updateCollection(updatedCollection).then(() => {
            setShowDeleteDialog(false);
            setSlideToDelete(null);
        });
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
