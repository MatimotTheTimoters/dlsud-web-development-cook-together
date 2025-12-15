import React, { useState } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

function IngredientChecklist({ ingredients }) {
    const [checked, setChecked] = useState([]);
    const ingredientArray = ingredients ? ingredients.split(',').filter(i => i.trim()) : [];

    const toggleItem = (index) => {
        setChecked(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const checkAll = () => setChecked([...Array(ingredientArray.length).keys()]);
    const uncheckAll = () => setChecked([]);

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1D3557' }}>
                    📝 Ingredients Checklist
                </Typography>
                <Box>
                    <Button size="small" onClick={checkAll} sx={{ mr: 1, fontSize: '0.8rem' }}>
                        Check All
                    </Button>
                    <Button size="small" onClick={uncheckAll} sx={{ fontSize: '0.8rem' }}>
                        Uncheck All
                    </Button>
                </Box>
            </Box>

            {ingredientArray.map((ing, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Button
                        size="small"
                        onClick={() => toggleItem(i)}
                        sx={{
                            color: checked.includes(i) ? '#4CAF50' : '#757575',
                            minWidth: 'auto',
                            mr: 2
                        }}
                    >
                        {checked.includes(i) ? <CheckCircle /> : <RadioButtonUnchecked />}
                    </Button>
                    <Typography sx={{
                        color: checked.includes(i) ? '#757575' : '#1D3557',
                        textDecoration: checked.includes(i) ? 'line-through' : 'none'
                    }}>
                        {ing.trim()}
                    </Typography>
                </Box>
            ))}

            <Typography variant="caption" sx={{ color: '#757575', mt: 2, display: 'block' }}>
                {checked.length} of {ingredientArray.length} completed
            </Typography>
        </Paper>
    );
}

export default IngredientChecklist;