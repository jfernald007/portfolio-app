import React, { useState } from 'react';
import { Group, Box, Stack } from '@mantine/core';
import Collections from './Collections';
import Slides from './Slides';
import SlideViewer from './SlideViewer';

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
    const [activeCollection, setActiveCollection] = useState<Collection | null>(
        null
    );
    const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

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
                        onSelectCollection={handleSelectCollection}
                        activeCollection={activeCollection}
                    />
                </Box>
                <Box px="10" className="dashRight">
                    <Stack w={'100%'}>
                        <Group
                            className="slideViewerContainer"
                            justify="center"
                            align="center"
                        >
                            <SlideViewer selectedSlide={selectedSlide} />
                        </Group>
                        <Slides
                            activeCollection={activeCollection}
                            updateCollection={async (
                                updatedCollection: Collection
                            ) => {
                                await setActiveCollection(updatedCollection);
                            }} // Handle promise from updateCollection
                            onSelectSlide={handleSelectSlide} // Handle slide selection
                            activeSlide={selectedSlide} // Pass active slide to Slides component
                        />
                    </Stack>
                </Box>
            </Group>
        </Box>
    );
};

export default Dashboard;
