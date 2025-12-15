import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Box,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack, Settings, LocationOn, EmojiEvents } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile.php?id=1');
      setProfile(response.data);
    } catch (error) {
      console.log('Using fallback data');
      // Fallback data
      setProfile({
        success: true,
        user: {
          username: 'chefjohn',
          full_name: 'Chef John',
          bio: 'Professional chef with 10 years experience',
          location: 'New York',
          cooking_since: '2018'
        },
        stats: {
          level: 15,
          current_exp: 1250,
          gold_count: 500,
          gem_count: 25,
          recipes_created: 50,
          recipes_cooked: 12
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

  if (!profile) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Failed to load profile</Typography>
      </Container>
    );
  }

  const { user, stats } = profile;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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

        {/* Profile Card */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {/* Avatar & Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ width: 100, height: 100, border: '3px solid #E63946', fontSize: '2.5rem', bgcolor: '#A8DADC' }}>
              {user.full_name?.charAt(0) || '👤'}
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ color: '#1D3557', fontWeight: 'bold' }}>
                {user.full_name || user.username}
              </Typography>
              <Typography sx={{ color: '#457B9D', mb: 1 }}>
                @{user.username}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: '#FFD700' }} />
                <Typography sx={{ color: '#1D3557' }}>
                  Level {stats.level}
                </Typography>
                <Box sx={{ mx: 1 }}>•</Box>
                <LocationOn sx={{ color: '#E63946' }} />
                <Typography sx={{ color: '#1D3557' }}>
                  {user.location}
                </Typography>
              </Box>

              {user.bio && (
                <Typography sx={{ mt: 2, color: '#1D3557' }}>
                  {user.bio}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Stats Grid */}
          <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
            📊 Stats
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Card sx={{ bgcolor: '#A8DADC', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1D3557' }}>
                  {stats.recipes_created}
                </Typography>
                <Typography variant="caption" sx={{ color: '#457B9D' }}>
                  Recipes
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#A8DADC', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1D3557' }}>
                  {stats.recipes_cooked}
                </Typography>
                <Typography variant="caption" sx={{ color: '#457B9D' }}>
                  Cooked
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#A8DADC', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1D3557' }}>
                  {stats.gold_count}
                </Typography>
                <Typography variant="caption" sx={{ color: '#457B9D' }}>
                  Gold
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
}

export default ProfilePage;