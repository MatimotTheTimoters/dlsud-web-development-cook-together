import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function ImageUpload({ onImageSelect }) {
    const [preview, setPreview] = useState(null);
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
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageSelect(file);
            };
            reader.readAsDataURL(file);

            enqueueSnackbar('✅ Image selected!', { variant: 'success' });
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
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#457B9D' }
                }}
                onClick={() => document.getElementById('image-upload').click()}
            >
                {preview ? (
                    <Box>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                marginBottom: '10px'
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreview(null);
                                onImageSelect(null);
                            }}
                        >
                            Remove Image
                        </Button>
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