import React, { useState } from 'react';
import { Stack, Text, Group, ActionIcon, Menu, Box } from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconX,
    IconDotsVertical,
} from '@tabler/icons-react';
import SlideForm from './SlideForm';
import CustomDialog from './CustomDialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    updateCollection: (updatedCollection: Collection) => Promise<void>;
    onSelectSlide: (slide: Slide) => void;
    activeSlide: Slide | null;
}

const Slides: React.FC<SlidesProps> = ({
    activeCollection,
    updateCollection,
    onSelectSlide,
    activeSlide,
}) => {
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);
    const [dialogTitle, setDialogTitle] = useState('');

    // Function to handle slide creation or update
    const handleSlideSubmit = async (slideData: Partial<Slide>) => {
        if (!activeCollection) return;

        try {
            let response;

            if (editingSlide) {
                // If editing an existing slide, make a PUT request
                response = await fetch(
                    `http://localhost:5001/api/collections/${activeCollection._id}/slides/${editingSlide._id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: slideData.title,
                            content: slideData.content,
                        }),
                    }
                );
            } else {
                // If creating a new slide, make a POST request
                response = await fetch(
                    `http://localhost:5001/api/collections/${activeCollection._id}/slides`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: slideData.title,
                            content: slideData.content,
                        }),
                    }
                );
            }

            if (!response.ok) {
                throw new Error(
                    editingSlide
                        ? 'Failed to update slide'
                        : 'Failed to create slide'
                );
            }

            const updatedCollection = await response.json();

            // Add the new slide to the top of the list or update the edited one in place
            const reorderedSlides = editingSlide
                ? activeCollection.slides.map((slide) =>
                      slide._id === editingSlide._id
                          ? { ...slide, ...slideData }
                          : slide
                  )
                : [
                      updatedCollection.slides[
                          updatedCollection.slides.length - 1
                      ],
                      ...activeCollection.slides,
                  ];

            // Update collection in the backend with the reordered slides
            await fetch(
                `http://localhost:5001/collections/${activeCollection._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...activeCollection,
                        slides: reorderedSlides,
                    }),
                }
            );

            // Update the collection in the frontend
            await updateCollection({
                ...activeCollection,
                slides: reorderedSlides,
            });

            setShowDialog(false); // Close the dialog after submitting
            setEditingSlide(null); // Reset editing state
        } catch (error) {
            console.error('Error saving slide:', error);
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

    // Handle drag and drop
    const onDragEnd = async (result: any) => {
        if (!result.destination || !activeCollection) return;

        const reorderedSlides = Array.from(activeCollection.slides);
        const [removed] = reorderedSlides.splice(result.source.index, 1);
        reorderedSlides.splice(result.destination.index, 0, removed);

        const updatedCollection = {
            ...activeCollection,
            slides: reorderedSlides,
        };

        try {
            // Update the backend with the new order of slides
            await fetch(
                `http://localhost:5001/collections/${activeCollection._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedCollection),
                }
            );

            await updateCollection(updatedCollection);
        } catch (error) {
            console.error('Error updating slide order:', error);
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
            const response = await fetch(
                `http://localhost:5001/api/collections/${activeCollection._id}/slides/${slideToDelete._id}`,
                {
                    method: 'DELETE',
                }
            );

            const updatedCollection = await response.json();
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
                                style={{ width: '90%', height: '90%' }}
                                stroke={1}
                            />
                        </ActionIcon>
                    </Group>

                    {/* Drag and Drop Context */}
                    <Box w={'100%'} className="slideContainer">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="slides">
                                {(provided) => (
                                    <Group
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{ flexWrap: 'nowrap' }}
                                    >
                                        {activeCollection.slides.map(
                                            (slide, index) => (
                                                <Draggable
                                                    key={slide._id}
                                                    draggableId={slide._id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <Group
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            w={300}
                                                            gap={9}
                                                            preventGrowOverflow
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            onClick={() =>
                                                                onSelectSlide(
                                                                    slide
                                                                )
                                                            }
                                                            className={`slideCard ${
                                                                slide ===
                                                                activeSlide
                                                                    ? 'active'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <Text
                                                                size={'13px'}
                                                                px={10}
                                                                py={3}
                                                                truncate
                                                                w={
                                                                    'calc(100% - 38px)'
                                                                }
                                                            >
                                                                {slide.title}
                                                            </Text>
                                                            <Menu
                                                                withinPortal
                                                                position="bottom-end"
                                                                shadow="sm"
                                                            >
                                                                <Menu.Target>
                                                                    <ActionIcon variant="transparent">
                                                                        <IconDotsVertical
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </ActionIcon>
                                                                </Menu.Target>

                                                                <Menu.Dropdown>
                                                                    <Menu.Item
                                                                        onClick={() =>
                                                                            openSlideDialog(
                                                                                slide
                                                                            )
                                                                        }
                                                                    >
                                                                        <Group>
                                                                            <IconEdit
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <Text>
                                                                                Edit
                                                                            </Text>
                                                                        </Group>
                                                                    </Menu.Item>
                                                                    <Menu.Item
                                                                        onClick={() =>
                                                                            duplicateSlide(
                                                                                slide
                                                                            )
                                                                        }
                                                                    >
                                                                        <Group>
                                                                            <IconEdit
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <Text>
                                                                                Duplicate
                                                                            </Text>
                                                                        </Group>
                                                                    </Menu.Item>
                                                                    <Menu.Item
                                                                        onClick={() =>
                                                                            openDeleteDialog(
                                                                                slide
                                                                            )
                                                                        }
                                                                        color="red"
                                                                    >
                                                                        <Group>
                                                                            <IconX
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <Text>
                                                                                Delete
                                                                            </Text>
                                                                        </Group>
                                                                    </Menu.Item>
                                                                </Menu.Dropdown>
                                                            </Menu>
                                                        </Group>
                                                    )}
                                                </Draggable>
                                            )
                                        )}
                                        {provided.placeholder}
                                    </Group>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>

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
