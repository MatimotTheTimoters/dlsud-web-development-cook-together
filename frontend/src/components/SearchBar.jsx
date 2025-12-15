import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SearchBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Call parent function to handle search
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <Box sx={{ position: 'relative', width: 300 }}>
            <TextField
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                size="small"
                sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#A8DADC',
                        },
                        '&:hover fieldset': {
                            borderColor: '#457B9D',
                        },
                    },
                }}
                InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: '#457B9D' }} />,
                }}
            />
        </Box>
    );
}

export default SearchBar;