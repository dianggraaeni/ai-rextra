import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';

// Skala definisi dari backend untuk tampilan
const SCALE_DEFINITIONS = {
    'Minat': {
        1: 'Tidak Tertarik', 2: 'Kurang Tertarik', 3: 'Netral',
        4: 'Tertarik', 5: 'Sangat Tertarik'
    },
    'Kepercayaan Diri': {
        1: 'Tidak Yakin', 2: 'Kurang Yakin', 3: 'Ragu-ragu',
        4: 'Yakin', 5: 'Sangat Yakin'
    },
    'Frekuensi': {
        1: 'Tidak Pernah', 2: 'Jarang', 3: 'Kadang-kadang',
        4: 'Sering', 5: 'Sangat Sering'
    }
};

const QUESTIONS_PER_PAGE = 12;

const RiasecTest = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Mengambil semua pertanyaan dari backend saat komponen dimuat
    axios.get('/api/riasec/questions')
      .then(response => {
        setAllQuestions(response.data);
        // Inisialisasi state jawaban
        const initialAnswers = {};
        response.data.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat pertanyaan. Silakan muat ulang halaman.');
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);
  const progress = (currentPage / totalPages) * 100;

  // Mendapatkan pertanyaan untuk halaman saat ini
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = allQuestions.slice(startIndex, endIndex);

  // Cek apakah semua pertanyaan di halaman ini sudah terjawab
  const isPageComplete = currentQuestions.every(q => answers[q.id] !== null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    setError(''); // Hapus error saat pengguna mulai menjawab
  };

  const handleNextPage = () => {
    if (!isPageComplete) {
      setError('Harap jawab semua pertanyaan di halaman ini sebelum melanjutkan.');
      return;
    }
    setError('');
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0); // Scroll ke atas halaman
    }
  };
  
  const handleSubmit = () => {
    if (!isPageComplete) {
        setError('Harap jawab semua pertanyaan di halaman ini sebelum menyelesaikan tes.');
        return;
    }
    setError('');
    setSubmitting(true);

    const orderedAnswers = allQuestions.map(q => answers[q.id]);
    
    axios.post('/api/riasec/submit', { answers: orderedAnswers })
      .then(() => {
        navigate('/assessment'); 
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal mengirim jawaban. Silakan coba lagi.');
        setSubmitting(false);
      });
  };
  
  if (loading) {
    return (
        <Container sx={{ textAlign: 'center', mt: 10 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Memuat Tes...</Typography>
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: '12px' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary.main" sx={{ fontWeight: 'bold' }}>
          Tes Kepribadian RIASEC
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Halaman {currentPage} dari {totalPages}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}>
          {currentQuestions.map((q, index) => (
            <Grid item xs={12} md={6} key={q.id}>
              <Box component={Paper} variant="outlined" sx={{ p: 3, height: '100%', borderRadius: '8px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {startIndex + index + 1}. <i>(Skala: {q.skala})</i>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, minHeight: '3em' }}>
                  {q.pertanyaan}
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup 
                    row 
                    name={`question-${q.id}`} 
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {[1, 2, 3, 4, 5].map(val => (
                      <Box key={val} sx={{ textAlign: 'center' }}>
                        <FormControlLabel
                          value={val}
                          control={<Radio />}
                          label={val.toString()}
                          labelPlacement="top"
                          sx={{ m: 0 }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {SCALE_DEFINITIONS[q.skala][val]}
                        </Typography>
                      </Box>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          {currentPage < totalPages ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleNextPage}
              disabled={!isPageComplete || submitting}
            >
              Lanjut
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleSubmit}
              disabled={!isPageComplete || submitting}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Selesai & Lihat Hasil'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RiasecTest;