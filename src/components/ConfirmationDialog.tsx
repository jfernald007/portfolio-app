import React from 'react';
import { Modal, Text, Button, Group } from '@mantine/core';

// Define the props interface
interface ConfirmationDialogProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    opened,
    onClose,
    onConfirm,
    itemName,
}) => {
    return (
        <Modal opened={opened} onClose={onClose} title="Confirm Deletion">
            <Text>Are you sure you want to delete "{itemName}"?</Text>
            <Group mt="md">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="red" onClick={onConfirm}>
                    Delete
                </Button>
            </Group>
        </Modal>
    );
};

export default ConfirmationDialog;
