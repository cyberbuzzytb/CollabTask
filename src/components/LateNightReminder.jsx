import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const LateNightReminder = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white'
        }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Don't forget to pack your bag!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            It's getting late! Make sure you have everything ready for tomorrow.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100',
              transform: 'translateY(-1px)',
              boxShadow: 3
            },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LateNightReminder; 
