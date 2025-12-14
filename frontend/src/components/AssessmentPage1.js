import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Radio, RadioGroup,
  FormControlLabel, FormControl, LinearProgress, Paper, TextField, FormLabel
} from '@mui/material';

const AssessmentPage1 = () => {
  const [statements, setStatements] = useState(null);
  const [answers, setAnswers] = useState({
    tasks: { choice: '', reason: '' },
    challenges: { choice: '', reason: '' },
    long_term: { choice: '', reason: '' },
    skills_to_learn: { choice: '', reason: '' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('/api/assessment/start')
      .then(response => {
        setStatements(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal memulai asesmen. Selesaikan tes RIASEC terlebih dahulu.');
        setLoading(false);
      });
  }, []);

  const handleChange = (type, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validasi sederhana
    for (const key in answers) {
        if (!answers[key].choice || !answers[key].reason.trim()) {
            setError('Harap isi semua pilihan dan alasan.');
            return;
        }
    }
    setError('');
    navigate('/assessment/2', { state: { page1Answers: answers } });
  };
  
  const renderQuestionBlock = (key, label, options) => (
    <Box component={Paper} elevation={2} sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset" fullWidth required>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{label}</FormLabel>
            <RadioGroup
                name={key}
                value={answers[key].choice}
                onChange={(e) => handleChange(key, 'choice', e.target.value)}
            >
                {options.map((option, index) => (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                ))}
            </RadioGroup>
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Jelaskan alasan Anda di sini..."
                variant="outlined"
                value={answers[key].reason}
                onChange={(e) => handleChange(key, 'reason', e.target.value)}
                sx={{ mt: 2 }}
                required
            />
        </FormControl>
    </Box>
  );

  if (loading) {
    return <Container><Typography align="center" sx={{mt: 5}}>Memuat Asesmen...</Typography><LinearProgress sx={{mt: 2}} /></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Asesmen Lanjutan (1/2)
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Pilih pernyataan yang paling relevan dan berikan penjelasan singkat.
        </Typography>

        <LinearProgress variant="determinate" value={50} sx={{ my: 3 }} />

        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}

        {statements ? (
            <form onSubmit={handleSubmit}>
                {renderQuestionBlock('tasks', '1. Pilih jenis tugas atau aktivitas yang paling Anda nikmati.', statements.page1.tasks)}
                {renderQuestionBlock('challenges', '2. Pilih tantangan kerja yang paling menarik bagi Anda.', statements.page1.challenges)}
                {renderQuestionBlock('long_term', '3. Pilih peran jangka panjang yang paling sesuai dengan minat Anda.', statements.page1.longterm)}
                {renderQuestionBlock('skills_to_learn', '4. Pilih keterampilan yang paling ingin Anda kuasai.', statements.page1.skillstolearn)}
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button type="submit" variant="contained" size="large">
                        Lanjut ke Halaman Berikutnya
                    </Button>
                </Box>
            </form>
        ) : (
            !loading && <Typography align="center">Gagal memuat data asesmen.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AssessmentPage1;