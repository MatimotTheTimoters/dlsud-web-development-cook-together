import React, { useState } from 'react';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import {
    Home, Restaurant, Book, Group, Store, Person,
    AddCircle, ExitToApp, Close
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!user;

    const handleLogout = () => {
        localStorage.removeItem('user');
        setLogoutConfirmOpen(false);
        onClose();
        navigate('/');
        window.location.reload();
    };

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Recipes', icon: <Restaurant />, path: '/recipes' },
        { text: 'My Cookbook', icon: <Book />, path: '/cookbook' },
        { text: 'Sessions', icon: <Group />, path: '/sessions' },
        { text: 'Shop', icon: <Store />, path: '/shop' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'Create Recipe', icon: <AddCircle />, path: '/create-recipe' },
    ];

    return (
        <>
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        bgcolor: '#F1FAEE',
                        borderRight: '2px solid #A8DADC'
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid #A8DADC', position: 'relative' }}>
                    <Typography variant="h6" sx={{ color: '#1D3557', fontWeight: 'bold', pr: 4 }}>
                        🍳 CookTogether
                    </Typography>
                    {isLoggedIn && (
                        <Typography variant="body2" sx={{ color: '#457B9D', mt: 0.5 }}>
                            Hi, {user.username}!
                        </Typography>
                    )}
                    <Button
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            minWidth: 'auto',
                            color: '#666'
                        }}
                    >
                        <Close />
                    </Button>
                </Box>

                <List sx={{ p: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            onClick={onClose}
                            sx={{
                                color: '#1D3557',
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: '#A8DADC',
                                    transform: 'translateX(4px)',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#457B9D', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                        </ListItem>
                    ))}

                    {isLoggedIn && (
                        <ListItem
                            onClick={() => setLogoutConfirmOpen(true)}
                            sx={{
                                color: '#E63946',
                                borderRadius: 1,
                                mt: 2,
                                '&:hover': {
                                    bgcolor: '#FFCDD2',
                                    transform: 'translateX(4px)',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#E63946', minWidth: 40 }}>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                        </ListItem>
                    )}
                </List>
            </Drawer>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutConfirmOpen}
                onClose={() => setLogoutConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ color: '#1D3557', fontWeight: 'bold', pb: 1 }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#666' }}>
                        Are you sure you want to logout? You'll need to sign in again to access your recipes and cookbook.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setLogoutConfirmOpen(false)}
                        variant="outlined"
                        sx={{
                            color: '#666',
                            borderColor: '#BDBDBD',
                            '&:hover': { borderColor: '#9E9E9E' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        sx={{
                            bgcolor: '#E63946',
                            '&:hover': { bgcolor: '#d32f2f' }
                        }}
                        autoFocus
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;