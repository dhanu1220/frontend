import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Mic,
  Stop,
  Send,
  Image,
  CloudUpload,
  Clear,
  SmartToy,
  Psychology,
  AttachFile,
} from '@mui/icons-material';
import Navbar from 'E:/cat_hackathon/frontend/src/pages/Home/navbar.js';
import Sidebar from 'E:/cat_hackathon/frontend/src/pages/Home/sidebar.js';
import useAudioRecording from 'E:/cat_hackathon/frontend/src/hooks/useAudioRecording.js';

const drawerWidth = 260;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(30, 60, 114, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

const InputCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: '2px solid #e0e0e0',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#1e3c72',
  },
  '&:focus-within': {
    borderColor: '#1e3c72',
    boxShadow: '0 0 0 2px rgba(30, 60, 114, 0.2)',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: '#f8fafc',
  border: '1px solid rgba(30, 60, 114, 0.1)',
  marginBottom: theme.spacing(2),
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  borderRadius: 12,
  padding: 12,
  transition: 'all 0.3s ease',
  border: '1px solid rgba(30, 60, 114, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const SmartAssist = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav] = useState('smartassist');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const fileInputRef = useRef(null);
  const audioFileRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use the audio recording hook
  const {
    isRecording,
    isLoading: audioLoading,
    error: audioError,
    transcript,
    nlpResults,
    startRecording,
    stopRecording,
    processAudioFile,
    clearResults: clearAudioResults,
  } = useAudioRecording();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const processText = async () => {
    if (!textInput.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.entities || []);
    } catch (error) {
      console.error('Text processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('http://localhost:8000/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = () => {
    if (textInput.trim()) {
      processText();
    } else if (selectedImage) {
      processImage();
    }
  };

  const clearAll = () => {
    setTextInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setResults([]);
    clearAudioResults();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAttendance = () => {
    setAttendanceStatus(attendanceStatus === 'checked-out' ? 'checked-in' : 'checked-out');
  };

  // Update text input when transcript is available
  const displayText = transcript || textInput;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar
        attendanceStatus={attendanceStatus}
        handleAttendance={handleAttendance}
        currentTime={currentTime}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#1e3c72',
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
              }}
            >
              <SmartToy sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="#1e3c72" gutterBottom>
              Smart Assist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Intelligent text, image, and audio processing powered by AI
            </Typography>
          </Box>

          {/* Input Section */}
          <InputCard sx={{ mb: 4 }}>
            <CardContent>
              {/* Image Preview */}
              {imagePreview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: 8,
                        border: '2px solid #1e3c72'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: '#f44336',
                        color: 'white',
                        '&:hover': { bgcolor: '#d32f2f' },
                      }}
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* Audio Error */}
              {audioError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {audioError}
                </Alert>
              )}

              {/* Recording Status */}
              {isRecording && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: '#f44336',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                  <Typography variant="body2" color="#f44336">
                    Recording... Click the mic button to stop
                  </Typography>
                </Box>
              )}

              {/* Main Input */}
              <TextField
                fullWidth
                multiline
                rows={6}
                value={displayText}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message, upload an image, or record audio for AI analysis..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Bottom Action Icons */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Divider sx={{ mb: 2, opacity: 0.6 }} />
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  {/* Image Upload */}
                  <Tooltip title="Upload Image">
                    <IconButtonStyled
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ 
                        color: '#1e3c72',
                        bgcolor: 'rgba(30, 60, 114, 0.05)',
                        '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.1)' }
                      }}
                    >
                      <Image />
                    </IconButtonStyled>
                  </Tooltip>

                  {/* Voice Recording */}
                  <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
                    <IconButtonStyled
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={audioLoading}
                      sx={{
                        color: isRecording ? '#f44336' : '#1e3c72',
                        bgcolor: isRecording ? 'rgba(244, 67, 54, 0.1)' : 'rgba(30, 60, 114, 0.05)',
                        '&:hover': {
                          bgcolor: isRecording ? 'rgba(244, 67, 54, 0.2)' : 'rgba(30, 60, 114, 0.1)',
                        },
                      }}
                    >
                      {isRecording ? <Stop /> : <Mic />}
                    </IconButtonStyled>
                  </Tooltip>

                  {/* Audio File Upload */}
                  <Tooltip title="Upload Audio File">
                    <IconButtonStyled
                      onClick={() => audioFileRef.current?.click()}
                      disabled={audioLoading}
                      sx={{ 
                        color: '#1e3c72',
                        bgcolor: 'rgba(30, 60, 114, 0.05)',
                        '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.1)' }
                      }}
                    >
                      <AttachFile />
                    </IconButtonStyled>
                  </Tooltip>

                  {/* Clear Button */}
                  {(displayText || selectedImage) && (
                    <Tooltip title="Clear All">
                      <IconButtonStyled
                        onClick={clearAll}
                        sx={{ 
                          color: '#666',
                          bgcolor: 'rgba(102, 102, 102, 0.05)',
                          '&:hover': { bgcolor: 'rgba(102, 102, 102, 0.1)' }
                        }}
                      >
                        <Clear />
                      </IconButtonStyled>
                    </Tooltip>
                  )}
                </Stack>
              </Box>

              {/* Hidden File Inputs */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                ref={audioFileRef}
                style={{ display: 'none' }}
              />

              {/* Process Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <StyledButton
                  variant="contained"
                  startIcon={
                    isProcessing || audioLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Psychology />
                    )
                  }
                  onClick={handleProcess}
                  disabled={(!displayText.trim() && !selectedImage) || isProcessing || audioLoading}
                  sx={{ 
                    bgcolor: '#1e3c72',
                    minWidth: 200,
                    py: 1.5,
                  }}
                  size="large"
                >
                  {isProcessing || audioLoading ? 'Processing...' : 'Analyze with AI'}
                </StyledButton>
              </Box>
            </CardContent>
          </InputCard>

          {/* Results Section */}
          {((results.length > 0) || (nlpResults.length > 0)) && (
            <ResultCard>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#1e3c72" gutterBottom>
                  Analysis Results
                </Typography>
                <List>
                  {(nlpResults.length > 0 ? nlpResults : results).map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      <ListItemText
                        primary={item.text || item.name || item.description}
                        primaryTypographyProps={{ fontWeight: 'medium', color: '#1e3c72' }}
                        secondary={
                          <Chip
                            label={item.label || item.type || 'Entity'}
                            size="small"
                            sx={{
                              bgcolor: '#e3f2fd',
                              color: '#1e3c72',
                              fontSize: '0.75rem',
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </ResultCard>
          )}
        </Container>
      </Box>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default SmartAssist;