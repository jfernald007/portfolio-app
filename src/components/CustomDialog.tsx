import React from 'react';
import { Modal, Button, Group } from '@mantine/core';

interface CustomDialogProps {
    opened: boolean;
    title: string;
    content: React.ReactNode;
    onConfirm?: () => void; // Make optional
    onCancel: () => void;
    confirmLabel?: string; // Make optional
    cancelLabel?: string; // Make optional
    showButtons?: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
    opened,
    title,
    content,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    showButtons = true,
}) => {
    return (
        <Modal opened={opened} onClose={onCancel} title={title}>
            {content}
            {showButtons && (
                <Group>
                    <Button variant="outline" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button onClick={onConfirm}>{confirmLabel}</Button>
                </Group>
            )}
        </Modal>
    );
};

export default CustomDialog;
