import React, { useState } from 'react';
import { Stack, Text, Button, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconEdit, IconX } from '@tabler/icons-react';
import SlideForm from './SlideForm';
import CustomDialog from './CustomDialog';

const generateSlideId = (collectionId) => {
    return `${collectionId}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
};

const Slides = ({ activeCollection, updateCollection }) => {
    const [editingSlide, setEditingSlide] = useState(null); // Track the slide being edited
    const [showDialog, setShowDialog] = useState(false); // Control for showing the form dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Control for delete confirmation dialog
    const [slideToDelete, setSlideToDelete] = useState(null); // Track the slide to delete
    const [dialogTitle, setDialogTitle] = useState(''); // Title for the dialog

    // Function to handle slide creation or update
    const handleSlideSubmit = (slideData) => {
        if (!activeCollection) return;

        const updatedSlides = editingSlide
            ? activeCollection.slides.map((slide) =>
                  slide._id === editingSlide._id
                      ? { ...slide, ...slideData } // Only update the matching slide
                      : slide
              )
            : [
                  ...activeCollection.slides,
                  { _id: generateSlideId(activeCollection._id), ...slideData }, // Generate a unique _id
              ];

        const updatedCollection = {
            ...activeCollection,
            slides: updatedSlides, // Update the slides array in the active collection
        };

        console.log('Updated collection with slides:', updatedCollection);
        updateCollection(updatedCollection).then(() => {
            setShowDialog(false); // Close the dialog after save
            setEditingSlide(null); // Reset editing state
        });
    };

    // Function to open the dialog to create or edit a slide
    const openSlideDialog = (slide = null) => {
        setEditingSlide(slide); // Set the slide being edited (or null for new)
        setDialogTitle(slide ? 'Edit Slide' : 'Create Slide');
        setShowDialog(true);
    };

    // Function to open the delete confirmation dialog
    const openDeleteDialog = (slide) => {
        setSlideToDelete(slide); // Set the slide to be deleted
        setShowDeleteDialog(true); // Open the confirmation dialog
    };

    // Function to handle slide deletion
    const handleDeleteSlide = () => {
        const updatedSlides = activeCollection.slides.filter(
            (slide) => slide._id !== slideToDelete._id // Only keep slides that don't match the slideId
        );

        const updatedCollection = {
            ...activeCollection,
            slides: updatedSlides, // Update the slides array in the active collection
        };

        console.log(
            'Updated collection after deleting slide:',
            updatedCollection
        );
        updateCollection(updatedCollection).then(() => {
            setShowDeleteDialog(false); // Close the confirmation dialog
            setSlideToDelete(null); // Reset slideToDelete
        });
    };

    return (
        <Stack>
            {activeCollection ? (
                <>
                    <Group w={300} gap={7} preventGrowOverflow>
                        <Text
                            truncate
                            weight={600}
                            size="lg"
                            w={'calc(100% - 35px)'}
                        >
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
                        activeCollection.slides.map((slide) => {
                            console.log('Rendering slide with ID:', slide._id); // Log the _id to debug
                            return (
                                <Group
                                    w={300}
                                    gap={9}
                                    preventGrowOverflow
                                    key={slide._id}
                                >
                                    <Text truncate w={'calc(100% - 70px)'}>
                                        {slide.title}
                                    </Text>
                                    <Group gap={5}>
                                        <ActionIcon
                                            variant="transparent"
                                            aria-label="Settings"
                                            onClick={() =>
                                                openSlideDialog(slide)
                                            }
                                        >
                                            <IconEdit
                                                style={{
                                                    width: '90%',
                                                    height: '90%',
                                                }}
                                                stroke={1}
                                            />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="transparent"
                                            color="red"
                                            aria-label="Settings"
                                            onClick={() =>
                                                openDeleteDialog(slide)
                                            }
                                        >
                                            <IconX
                                                style={{
                                                    width: '90%',
                                                    height: '90%',
                                                }}
                                                stroke={1}
                                            />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            );
                        })
                    ) : (
                        <Text>No slides added yet.</Text>
                    )}

                    {/* Reusable Dialog for Creating/Editing Slides */}
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
                        showButtons={false} // No extra buttons, since the form has its own buttons
                    />

                    {/* Reusable Confirmation Dialog for Deleting Slides */}
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
                            showButtons={true} // Show confirm/cancel buttons
                        />
                    )}
                </>
            ) : (
                <Group w={300} gap={7} preventGrowOverflow>
                    <Text
                        truncate
                        weight={600}
                        size="lg"
                        w={'calc(100% - 35px)'}
                    >
                        Select a collection to view and add slides
                    </Text>
                </Group>
            )}
        </Stack>
    );
};

export default Slides;
