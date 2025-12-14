import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Typography, Button, Box, LinearProgress, Paper, TextField, FormLabel
} from '@mui/material';

const AssessmentPage2 = () => {
  const [answers, setAnswers] = useState({
    projects_exp: '',
    activities_exp: '',
    portfolio_exp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { page1Answers } = location.state || {};

  const handleChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!page1Answers) {
        setError('Data dari halaman sebelumnya tidak ditemukan. Harap kembali dan isi kembali.');
        return;
    }
     if (!answers.projects_exp.trim() || !answers.activities_exp.trim()) {
      setError('Harap isi semua kolom yang wajib diisi.');
      return;
    }

    const finalAnswers = {
        page1: page1Answers,
        page2: {
            ...answers,
            portfolio_exp: answers.portfolio_exp.trim() === '' ? '-' : answers.portfolio_exp
        }
    };

    setLoading(true);
    axios.post('/api/assessment/submit', { answers: finalAnswers })
      .then((response) => {
        // DEBUGGING: Log the exact data being sent to the next page's state
        console.log("Data received from backend, navigating to /results with:", response.data);
        navigate('/results', { state: { resultsData: response.data } });
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal mengirim asesmen. Silakan coba lagi.');
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Asesmen Lanjutan (2/2)
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Ceritakan tentang pengalaman praktis Anda.
        </Typography>
        
        <LinearProgress variant="determinate" value={100} sx={{ my: 3 }} />

        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>1. Ceritakan proyek relevan yang pernah Anda kerjakan.</FormLabel>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Apa yang Anda pelajari dari proyek tersebut?"
                    variant="outlined"
                    value={answers.projects_exp}
                    onChange={(e) => handleChange('projects_exp', e.target.value)}
                    required
                />
            </Box>

            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>2. Jelaskan keterlibatan Anda dalam aktivitas yang relevan dengan minat Anda.</FormLabel>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Seberapa sering Anda terlibat dan apa saja aktivitasnya?"
                    variant="outlined"
                    value={answers.activities_exp}
                    onChange={(e) => handleChange('activities_exp', e.target.value)}
                    required
                />
            </Box>

            <Box component={Paper} elevation={2} sx={{ p: 3, mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>3. Ceritakan tentang portofolio atau pencapaian yang paling relevan (Opsional).</FormLabel>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Jika tidak ada, isi dengan '-'."
                    variant="outlined"
                    value={answers.portfolio_exp}
                    onChange={(e) => handleChange('portfolio_exp', e.target.value)}
                />
            </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Menganalisis...' : 'Lihat Hasil Analisis'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AssessmentPage2;