import React from 'react';
import { Modal, Button, Group } from '@mantine/core';

const CustomDialog = ({
    opened,
    title,
    content,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    showButtons = true,
}) => {
    return (
        <Modal opened={opened} onClose={onCancel} title={title}>
            {content}{' '}
            {/* Content passed in as a prop (form or confirmation message) */}
            {/* Only show buttons if no form is passed in */}
            {showButtons && (
                <Group position="right" mt="md">
                    <Button variant="outline" onClick={onCancel}>
                        {cancelLabel || 'Cancel'}
                    </Button>
                    <Button onClick={onConfirm}>
                        {confirmLabel || 'Confirm'}
                    </Button>
                </Group>
            )}
        </Modal>
    );
};

export default CustomDialog;
