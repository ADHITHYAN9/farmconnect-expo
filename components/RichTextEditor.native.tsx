import React, { forwardRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { theme } from '@/constants';

const RichTextEditor = forwardRef<TextInput, { onChange: (body: string) => void }>(({ onChange }, ref) => {
    return (
        <TextInput
            ref={ref}
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="What's on your mind"
            placeholderTextColor="gray"
            multiline
            numberOfLines={10}
            onChangeText={onChange}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        borderColor: theme.colors.gray,
        borderRadius: theme.radius.xl,
        borderWidth: 1.5,
        minHeight: 240,
        padding: 12,
        textAlignVertical: 'top',
    },
});

export default RichTextEditor;
