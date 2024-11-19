import React, { useState, useEffect } from 'react';
import { Group, Box, Stack } from '@mantine/core';
import Collections from './Collections';
import Slides from './Slides';
import SlideViewer from './SlideViewer';
import axios from 'axios';

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

const Dashboard: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [activeCollection, setActiveCollection] = useState<Collection | null>(
        null
    );
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

    // Fetch collections from backend
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5001/collections'
                );
                setCollections(response.data);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };

        fetchCollections();
    }, []);

    // Update active collection
    const handleSelectCollection = (collection: Collection | null) => {
        setActiveCollection(collection);
        setSelectedSlide(null); // Reset selected slide when switching collections
    };

    // Update selected slide
    const handleSelectSlide = (slide: Slide | null) => {
        setSelectedSlide(slide); // Set the selected slide
    };

    return (
        <Box w={'100vw'} h={'100vh'}>
            <Group h="100%" gap="0" align="flex-start" justify="flex-start">
                <Box p={20} className="dashLeft">
                    <Collections
                        collections={collections}
                        onSelectCollection={handleSelectCollection}
                        activeCollection={activeCollection}
                    />
                </Box>
                <Box px="10" className="dashRight">
                    <Stack w={'100%'} gap={'0'}>
                        <Group
                            className="slideViewerContainer"
                            justify="center"
                            align="center"
                        >
                            <SlideViewer selectedSlide={selectedSlide} />
                        </Group>
                        <Box className="slideContainer">
                            <Slides
                                // collections={collections}
                                activeCollection={activeCollection}
                                updateCollection={async (
                                    updatedCollection: Collection
                                ) => {
                                    setCollections((prev) =>
                                        prev.map((col) =>
                                            col._id === updatedCollection._id
                                                ? updatedCollection
                                                : col
                                        )
                                    );
                                    setActiveCollection(updatedCollection);
                                }}
                                onSelectSlide={handleSelectSlide}
                                activeSlide={selectedSlide}
                            />
                        </Box>
                    </Stack>
                </Box>
            </Group>
        </Box>
    );
};

export default Dashboard;
