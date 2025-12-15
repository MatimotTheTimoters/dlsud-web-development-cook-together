import React, { useState, useRef } from 'react'; // Added useRef
import { Button, Box, Typography, Paper } from '@mui/material';
import { CloudUpload, Image, Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function ImageUpload({ onImageSelect }) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null); // Create a ref for the file input
    const { enqueueSnackbar } = useSnackbar();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                enqueueSnackbar('❌ Image must be less than 5MB', { variant: 'error' });
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                enqueueSnackbar('❌ Please upload an image file', { variant: 'error' });
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result;
                setPreview(base64String);
                onImageSelect(base64String); // Send base64 string
            };
            reader.readAsDataURL(file);

            enqueueSnackbar('✅ Image selected!', { variant: 'success' });
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelect(null); // Clear image

        // Reset file input properly
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        enqueueSnackbar('🗑️ Image removed', { variant: 'info' });
    };

    const handleReplaceImage = () => {
        // Directly trigger the file input click
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePaperClick = () => {
        // Only open file dialog if there's no preview
        if (!preview) {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                📷 Recipe Image (Optional)
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    border: '2px dashed #A8DADC',
                    textAlign: 'center',
                    backgroundColor: '#F1FAEE',
                    cursor: preview ? 'default' : 'pointer', // Change cursor if has preview
                    '&:hover': {
                        borderColor: preview ? '#A8DADC' : '#457B9D',
                        backgroundColor: preview ? '#F1FAEE' : '#f8f9fa'
                    }
                }}
                onClick={handlePaperClick}
            >
                {preview ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    borderRadius: '8px',
                                    objectFit: 'contain'
                                }}
                            />
                            <Button
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    minWidth: 'auto',
                                    padding: '4px 8px',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                    }
                                }}
                                onClick={handleRemoveImage}
                            >
                                <Close fontSize="small" />
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleReplaceImage}
                            >
                                Replace Image
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleRemoveImage}
                            >
                                Remove
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <CloudUpload sx={{ fontSize: 48, color: '#457B9D', mb: 1 }} />
                        <Typography sx={{ color: '#1D3557', mb: 1 }}>
                            Click to upload recipe image
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#457B9D' }}>
                            Supports JPG, PNG up to 5MB
                        </Typography>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </Paper>
        </Box>
    );
}

export default ImageUpload;