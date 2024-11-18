import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import {
    Stack,
    Text,
    Group,
    ActionIcon,
    Menu,
    Box,
    Center,
} from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconX,
    IconDotsVertical,
} from '@tabler/icons-react';

interface SlideProps {
    collections: any[];
    activeCollection: any | null;
    updateCollection: (updatedCollection: any) => Promise<void>;
    onSelectSlide: (slide: any | null) => void;
    activeSlide: any | null;
}

const Slides = ({
    collections,
    activeCollection,
    updateCollection,
    onSelectSlide,
    activeSlide,
}: SlideProps) => {
    const [slides, setSlides] = useState<any[]>([]);

    useEffect(() => {
        const fetchSlides = async () => {
            if (activeCollection) {
                const filteredSlides =
                    collections.find(
                        (collection) => collection._id === activeCollection._id
                    )?.slides || [];
                setSlides(filteredSlides);
                if (filteredSlides.length > 0) {
                    onSelectSlide(filteredSlides[0]);
                } else {
                    onSelectSlide(null);
                }
            }
        };
        fetchSlides();
    }, [activeCollection, collections, onSelectSlide]);

    const handleSlideSubmit = async (slide: any) => {
        try {
            if (slide._id) {
                await axios.put(`/api/slides/${slide._id}`, slide);
            } else {
                await axios.post('/api/slides', slide);
            }
            const response = await axios.get('/api/slides');
            setSlides(response.data);
        } catch (error) {
            console.error('Error creating/updating slide:', error);
        }
    };

    const handleDuplicateSlide = async (slide: any) => {
        try {
            const newSlide = { ...slide, _id: undefined };
            await axios.post('/api/slides', newSlide);
            const response = await axios.get('/api/slides');
            setSlides(response.data);
        } catch (error) {
            console.error('Error duplicating slide:', error);
        }
    };

    const onDragEnd = async (result: any) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (source.droppableId !== destination.droppableId) {
            try {
                await axios.post('/api/collections/move-slide', {
                    slideId: draggableId,
                    sourceCollectionId: source.droppableId,
                    targetCollectionId: destination.droppableId,
                });

                const updatedSlides = [...slides];
                const [movedSlide] = updatedSlides.splice(source.index, 1);
                updatedSlides.splice(destination.index, 0, movedSlide);
                setSlides(updatedSlides);

                console.log('Slide moved successfully');
            } catch (error) {
                console.error('Error moving slide:', error);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {collections.map((collection) => (
                <Droppable
                    key={collection._id}
                    droppableId={collection._id}
                    direction="horizontal"
                >
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="slide-container"
                        >
                            <Stack>
                                {slides
                                    .filter(
                                        (slide) =>
                                            slide.collectionId ===
                                            collection._id
                                    )
                                    .map((slide, index) => (
                                        <Draggable
                                            key={slide._id}
                                            draggableId={slide._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="slide-item"
                                                    onClick={() =>
                                                        onSelectSlide(slide)
                                                    }
                                                >
                                                    <Group>
                                                        <Text>
                                                            {slide.title}
                                                        </Text>
                                                        <Menu
                                                            withArrow
                                                            position="bottom-end"
                                                        >
                                                            <Menu.Target>
                                                                <ActionIcon>
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
                                                                        handleSlideSubmit(
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
                                                                        handleDuplicateSlide(
                                                                            slide
                                                                        )
                                                                    }
                                                                >
                                                                    <Group>
                                                                        <IconPlus
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
                                                                        console.log(
                                                                            'Delete slide'
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
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                {provided.placeholder}
                            </Stack>
                        </Box>
                    )}
                </Droppable>
            ))}
        </DragDropContext>
    );
};

export default Slides;
