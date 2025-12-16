import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { LocalDining, Person, Menu as MenuIcon, ShoppingCart, Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!user;

    const handleLogout = () => {
        setAnchorEl(null);
        setLogoutConfirmOpen(false);
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: '#1D3557' }}>
                <Toolbar>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <LocalDining sx={{ mr: 1, color: '#E63946' }} />
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { color: '#A8DADC' }
                            }}
                        >
                            CookTogether
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    {isLoggedIn ? (
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                            <Button
                                component={Link}
                                to="/recipes"
                                sx={{ color: 'white', '&:hover': { bgcolor: '#457B9D20' } }}
                            >
                                Recipes
                            </Button>
                            <Button
                                component={Link}
                                to="/shop"
                                startIcon={<ShoppingCart />}
                                sx={{ color: 'white', '&:hover': { bgcolor: '#457B9D20' } }}
                            >
                                Shop
                            </Button>
                            <Button
                                component={Link}
                                to="/sessions"
                                sx={{ color: 'white', '&:hover': { bgcolor: '#457B9D20' } }}
                            >
                                Sessions
                            </Button>
                        </Box>
                    ) : null}

                    {/* User Menu / Auth Buttons */}
                    <Box sx={{ ml: 2 }}>
                        {isLoggedIn ? (
                            <>
                                <IconButton
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                    sx={{
                                        color: 'white',
                                        '&:hover': { bgcolor: '#457B9D' }
                                    }}
                                >
                                    <Person />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                    PaperProps={{
                                        sx: {
                                            borderRadius: 2,
                                            mt: 1
                                        }
                                    }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to="/profile"
                                        onClick={() => setAnchorEl(null)}
                                    >
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        component={Link}
                                        to="/cookbook"
                                        onClick={() => setAnchorEl(null)}
                                    >
                                        My Cookbook
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                        setLogoutConfirmOpen(true);
                                    }}>
                                        <Logout sx={{ mr: 1, fontSize: 20 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': { borderColor: '#A8DADC', color: '#A8DADC' }
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#E63946',
                                        '&:hover': { bgcolor: '#d32f2f' }
                                    }}
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Mobile Menu Button */}
                    <IconButton
                        sx={{
                            display: { md: 'none' },
                            color: 'white',
                            ml: 2,
                            '&:hover': { bgcolor: '#457B9D' }
                        }}
                        onClick={toggleSidebar}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

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

export default Navbar;