import React, { useState } from 'react';
import { Group, Box } from '@mantine/core';
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
        <Box p={20}>
            <Group gap="lg" align="flex-start" justify="flex-start">
                {/* Column 1: Collections */}
                <Box style={{ flex: 1 }}>
                    <Collections
                        onSelectCollection={handleSelectCollection}
                        activeCollection={activeCollection}
                    />
                </Box>

                {/* Column 2: Slides */}
                <Box style={{ flex: 2 }}>
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
                </Box>

                {/* Column 3: Slide Viewer */}
                <Box style={{ flex: 2 }}>
                    {selectedSlide && ( // Only render SlideViewer if a slide is selected
                        <SlideViewer selectedSlide={selectedSlide} />
                    )}
                </Box>
            </Group>
        </Box>
    );
};

export default Dashboard;
