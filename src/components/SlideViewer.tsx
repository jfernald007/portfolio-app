import React from 'react';
import { Stack, Text, Box } from '@mantine/core';

// Define the type for the selected slide
interface Slide {
    _id: string;
    title: string;
    content: string;
}

interface SlideViewerProps {
    selectedSlide: Slide | null;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ selectedSlide }) => {
    if (!selectedSlide) {
        return <Text>Select a slide to view its details.</Text>;
    }

    return (
        <Stack>
            <Box>
                <Text fw={600} size="lg">
                    {selectedSlide.title}
                </Text>
                <Text>{selectedSlide.content}</Text>
            </Box>
        </Stack>
    );
};

export default SlideViewer;
