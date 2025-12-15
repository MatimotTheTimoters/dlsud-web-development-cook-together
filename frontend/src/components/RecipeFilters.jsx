import React, { useState, useEffect } from 'react';
import { Paper, FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Button, Box, Typography } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { motion } from 'framer-motion';

function RecipeFilters({ currentFilters, onFilterChange }) {
    const [filters, setFilters] = useState({
        difficulty: 'all',
        time: 'all',
        category: 'all'
    });

    // Update local state when parent filters change
    useEffect(() => {
        if (currentFilters) {
            setFilters(currentFilters);
        }
    }, [currentFilters]);

    const handleFilterChange = (type, value) => {
        const newFilters = { ...filters, [type]: value };
        setFilters(newFilters);

        // Call parent function immediately when filter changes
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleReset = () => {
        const resetFilters = {
            difficulty: 'all',
            time: 'all',
            category: 'all'
        };
        setFilters(resetFilters);

        if (onFilterChange) {
            onFilterChange(resetFilters);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Paper sx={{
                p: 3,
                mb: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                boxShadow: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FilterList sx={{ mr: 1, color: '#457B9D' }} />
                    <Typography variant="h6" color="#1D3557">
                        🔍 Filters
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {/* Difficulty Filter */}
                    <Box>
                        <Typography variant="body2" color="#1D3557" gutterBottom>
                            Difficulty:
                        </Typography>
                        <RadioGroup
                            row
                            value={filters.difficulty}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        >
                            <FormControlLabel
                                value="all"
                                control={<Radio size="small" />}
                                label="All"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                            <FormControlLabel
                                value="Easy"
                                control={<Radio size="small" />}
                                label="Easy"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                            <FormControlLabel
                                value="Medium"
                                control={<Radio size="small" />}
                                label="Medium"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                            <FormControlLabel
                                value="Hard"
                                control={<Radio size="small" />}
                                label="Hard"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        </RadioGroup>
                    </Box>

                    {/* Time Filter */}
                    <Box>
                        <Typography variant="body2" color="#1D3557" gutterBottom>
                            Time:
                        </Typography>
                        <Select
                            value={filters.time}
                            onChange={(e) => handleFilterChange('time', e.target.value)}
                            size="small"
                            sx={{
                                minWidth: 120,
                                backgroundColor: '#FFFFFF',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A8DADC',
                                },
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="30">≤ 30 min</MenuItem>
                            <MenuItem value="60">≤ 60 min</MenuItem>
                            <MenuItem value="90">≤ 90 min</MenuItem>
                        </Select>
                    </Box>

                    {/* Category Filter */}
                    <Box>
                        <Typography variant="body2" color="#1D3557" gutterBottom>
                            Category:
                        </Typography>
                        <Select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            size="small"
                            sx={{
                                minWidth: 120,
                                backgroundColor: '#FFFFFF',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#A8DADC',
                                },
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="Main Dish">Main Dish</MenuItem>
                            <MenuItem value="Dessert">Dessert</MenuItem>
                            <MenuItem value="Appetizer">Appetizer</MenuItem>
                            <MenuItem value="Breakfast">Breakfast</MenuItem>
                        </Select>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => {/* Already applying filters immediately */ }}
                        sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#45a049',
                            }
                        }}
                    >
                        Filters Applied
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleReset}
                        sx={{
                            color: '#757575',
                            borderColor: '#E0E0E0',
                            '&:hover': {
                                borderColor: '#BDBDBD',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Reset
                    </Button>
                </Box>
            </Paper>
        </motion.div>
    );
}

export default RecipeFilters;