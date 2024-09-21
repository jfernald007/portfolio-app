import React, { useState } from 'react';
import { Stack, Text, Button, Group } from '@mantine/core';
import SlideForm from './SlideForm';
import CustomDialog from './CustomDialog';

// Function to generate a unique ID based on the collection's ID
const generateSlideId = (collectionId) => {
    return `${collectionId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const Slides = ({ activeCollection, updateCollection }) => {
    const [editingSlide, setEditingSlide] = useState(null); // Track the slide being edited
    const [showDialog, setShowDialog] = useState(false); // Control for showing the form dialog
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
        updatedSlides.forEach((slide) => console.log('Slide ID:', slide._id)); // Log each slide's ID
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

    // Function to delete a slide
    const handleDeleteSlide = (slideId) => {
        const updatedSlides = activeCollection.slides.filter(
            (slide) => slide._id !== slideId // Only keep slides that don't match the slideId
        );

        const updatedCollection = {
            ...activeCollection,
            slides: updatedSlides, // Update the slides array in the active collection
        };

        console.log(
            'Updated collection after deleting slide:',
            updatedCollection
        );
        updateCollection(updatedCollection); // Persist the changes to the collection
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
                                    {' '}
                                    {/* Ensure slide._id is unique */}
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
                                                handleDeleteSlide(slide._id)
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
                    />
                </>
            ) : (
                <Text>Select a collection to view and add slides</Text>
            )}
        </Stack>
    );
};

export default Slides;
