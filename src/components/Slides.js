import React, { useState } from 'react';
import { Stack, Text, Button, Group } from '@mantine/core';
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
                    <Group position="apart">
                        <Text weight={600} size="lg">
                            Slides for {activeCollection.title}
                        </Text>
                        <Button onClick={() => openSlideDialog()}>
                            Create Slide
                        </Button>
                    </Group>

                    {/* List of slides */}
                    {activeCollection.slides.length > 0 ? (
                        activeCollection.slides.map((slide) => {
                            console.log('Rendering slide with ID:', slide._id); // Log the _id to debug
                            return (
                                <Group key={slide._id} position="apart">
                                    <Text>{slide.title}</Text>
                                    <Group>
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={() =>
                                                openSlideDialog(slide)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            color="red"
                                            onClick={() =>
                                                openDeleteDialog(slide)
                                            }
                                        >
                                            Delete
                                        </Button>
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
                <Text>Select a collection to view and add slides</Text>
            )}
        </Stack>
    );
};

export default Slides;
