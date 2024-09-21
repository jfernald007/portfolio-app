import React, { useState } from 'react';
import { Group, Box } from '@mantine/core';
import Collections from './Collections';
import Slides from './Slides';
import axios from 'axios';

const Dashboard = () => {
    const [activeCollection, setActiveCollection] = useState(null);

    // Update active collection after selection
    const handleSelectCollection = (collection) => {
        setActiveCollection(collection);
    };

    // Update collection after adding/editing slides and persist changes
    const updateActiveCollection = async (updatedCollection) => {
        try {
            const response = await axios.put(
                `http://localhost:5001/collections/${updatedCollection._id}`,
                updatedCollection
            );
            setActiveCollection(response.data); // Set the updated collection as active
        } catch (error) {
            console.error('Error updating collection:', error);
        }
    };

    return (
        <Box p={20} align="flex-start">
            <Group spacing="lg" align="flex-start" gap={30}>
                {/* Column 1: Collections */}
                <Box>
                    <Collections
                        onSelectCollection={handleSelectCollection}
                        activeCollection={activeCollection}
                    />
                </Box>

                {/* Column 2: Slides */}
                <Box>
                    <Slides
                        activeCollection={activeCollection}
                        updateCollection={updateActiveCollection}
                    />
                </Box>
            </Group>
        </Box>
    );
};

export default Dashboard;
