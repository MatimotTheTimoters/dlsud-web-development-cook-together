import React from 'react';
import { Box, Typography, IconButton, Button, Grid } from '@mui/material';
import {
  ContentCopy,
  Facebook,
  Twitter,
  QrCode2,
  WhatsApp,
  Email
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { copyToClipboard, shareOnFacebook, shareOnTwitter } from '../../utils/copyToClipboard';

const ShareOptions = ({ joinCode, sessionId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const shareUrl = `${window.location.origin}/session/${sessionId}/join?code=${joinCode}`;
  const shareMessage = `Join my cooking session! Code: ${joinCode}`;

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(joinCode);
      enqueueSnackbar('Code copied to clipboard!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to copy code', { variant: 'error' });
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareUrl);
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to copy link', { variant: 'error' });
    }
  };

  const handleShareFacebook = () => {
    shareOnFacebook(shareUrl);
    enqueueSnackbar('Opened Facebook share', { variant: 'info' });
  };

  const handleShareTwitter = () => {
    shareOnTwitter(shareUrl, shareMessage);
    enqueueSnackbar('Opened Twitter share', { variant: 'info' });
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n${shareUrl}`)}`, '_blank');
    enqueueSnackbar('Opened WhatsApp share', { variant: 'info' });
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=Join my cooking session!&body=${encodeURIComponent(`${shareMessage}\n${shareUrl}`)}`);
    enqueueSnackbar('Opened email compose', { variant: 'info' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Session Code */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Session Code
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={handleCopyCode}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                sx={{ letterSpacing: '0.2em' }}
              >
                {joinCode}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click to copy
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {/* Share Links */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Share Link
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {shareUrl}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Copy
            </Button>
          </Box>
        </Box>

        {/* Social Share Buttons */}
        <Box>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Share via
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { icon: <Facebook />, label: 'Facebook', color: '#1877F2', onClick: handleShareFacebook },
              { icon: <Twitter />, label: 'Twitter', color: '#1DA1F2', onClick: handleShareTwitter },
              { icon: <WhatsApp />, label: 'WhatsApp', color: '#25D366', onClick: handleShareWhatsApp },
              { icon: <Email />, label: 'Email', color: '#EA4335', onClick: handleShareEmail },
              { icon: <QrCode2 />, label: 'QR Code', color: '#757575', onClick: () => enqueueSnackbar('QR Code feature coming soon!', { variant: 'info' }) }
            ].map((platform, index) => (
              <Grid item key={index}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={platform.onClick}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: platform.color,
                      color: 'white',
                      '&:hover': {
                        bgcolor: platform.color,
                        opacity: 0.9
                      }
                    }}
                  >
                    {platform.icon}
                  </IconButton>
                </motion.div>
                <Typography variant="caption" display="block" textAlign="center" mt={0.5}>
                  {platform.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Instructions */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            <strong>How to join:</strong> Share the code or link with friends. 
            They can join by entering the code on the "Join Session" page or clicking the link.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ShareOptions;