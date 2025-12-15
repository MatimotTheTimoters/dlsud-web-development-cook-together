import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  IconButton,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Settings, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import UserAvatar from '../components/UserAvatar';
import StatsTabs from '../components/StatsTabs';
import EditProfileButton from '../components/EditProfileButton';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Try to get current user from localStorage (from login)
      const storedUser = JSON.parse(localStorage.getItem('user'));
      let userId = 1; // Default to user 1 if no user logged in

      if (storedUser && storedUser.id) {
        userId = storedUser.id;
        console.log('Using logged-in user ID:', userId);
      } else {
        console.log('No user in localStorage, defaulting to ID 1');
      }

      const response = await api.get(`/profile.php?id=${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.log('Error fetching profile:', error);
      // Simple fallback with generic user
      setProfile({
        success: true,
        user: {
          username: 'guest',
          full_name: 'Guest User',
          bio: 'Please login to see your profile',
          location: 'Unknown'
        },
        stats: {
          level: 1,
          recipes_created: 0,
          recipes_cooked: 0,
          challenges_completed: 0,
          gold_count: 100
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) return <Typography>Failed to load profile</Typography>;

  const { user, stats } = profile;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#457B9D' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            <ArrowBack />
          </IconButton>
          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
            👨‍🍳 Profile
          </Typography>
          <IconButton sx={{ color: 'white' }}>
            <Settings />
          </IconButton>
        </Paper>

        {/* Profile Content */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {/* User Avatar & Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <UserAvatar user={user} stats={stats} />

            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
              <Typography variant="h5" sx={{ color: '#1D3557', fontWeight: 'bold' }}>
                {user.full_name || user.username}
              </Typography>
              <Typography sx={{ color: '#457B9D', mb: 1 }}>
                @{user.username}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <LocationOn sx={{ color: '#E63946' }} />
                <Typography sx={{ color: '#1D3557' }}>
                  {user.location || 'Unknown'}
                </Typography>
              </Box>

              {user.bio && (
                <Typography sx={{ mt: 2, color: '#1D3557' }}>
                  {user.bio}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Stats Tabs */}
          <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
            📊 Cooking Stats
          </Typography>
          <StatsTabs stats={stats} />

          {/* Edit Profile Button */}
          <EditProfileButton />
        </Paper>
      </Container>
    </motion.div>
  );
}

export default ProfilePage;