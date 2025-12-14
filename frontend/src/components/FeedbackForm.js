import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Button, Box, Paper, TextField, FormControl,
  FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Alert
} from '@mui/material';

const FeedbackForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultsData } = location.state || {};
  const recommendations = resultsData?.results?.analysis || [];
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    usia: '',
    program_studi: '',
    profesi_saat_ini: '',
    rekomendasi_sesuai: {},
    penjelasan_rekomendasi: '',
    skala_kepuasan: '',
    saran_masukan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      rekomendasi_sesuai: {
        ...prev.rekomendasi_sesuai,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const feedbackPayload = {
        ...formData,
        rekomendasi_sesuai: Object.keys(formData.rekomendasi_sesuai).filter(key => formData.rekomendasi_sesuai[key]),
    };

    setLoading(true);
    axios.post('/api/feedback', feedbackPayload)
      .then(() => {
        setSuccess('Terima kasih! Feedback Anda telah terkirim. Anda akan dialihkan ke halaman utama.');
        setTimeout(() => navigate('/'), 3000);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal mengirim feedback. Silakan coba lagi.');
        setLoading(false);
      });
  };

  if (!resultsData) {
     return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5" color="error">Data hasil tidak ditemukan untuk memberikan feedback.</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Kembali ke Tes
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" align="center" color="primary">Form Feedback Pengujian</Typography>
        <Typography variant="h6" component="h2" align="center" gutterBottom>REXTRA - KENALI DIRI</Typography>

        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom>Data Partisipan</Typography>
            <TextField label="Nama Lengkap" name="nama_lengkap" fullWidth margin="normal" onChange={handleChange} required />
            <TextField label="Usia" name="usia" type="number" fullWidth margin="normal" onChange={handleChange} required />
            <TextField label="Program Studi semasa kuliah" name="program_studi" fullWidth margin="normal" onChange={handleChange} required />
            <TextField label="Profesi saat ini" name="profesi_saat_ini" fullWidth margin="normal" onChange={handleChange} required />
          </Box>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h5" gutterBottom>Feedback Anda</Typography>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">1. Dari daftar rekomendasi, apakah ada yang sesuai dengan profesi Anda saat ini?</FormLabel>
              <FormGroup>
                {recommendations.map(rec => (
                  <FormControlLabel
                    key={rec.profession}
                    control={<Checkbox onChange={handleCheckboxChange} name={rec.profession} />}
                    label={rec.profession}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <TextField label="2. Bagaimana pendapat Anda mengenai penjelasan rekomendasi?" name="penjelasan_rekomendasi" fullWidth margin="normal" multiline rows={4} onChange={handleChange} />
            <FormControl component="fieldset" fullWidth margin="normal" required>
              <FormLabel component="legend">3. Dari skala 1-10, seberapa puas Anda dengan fitur ini?</FormLabel>
              <RadioGroup row name="skala_kepuasan" onChange={handleChange}>
                {[...Array(10).keys()].map(i => (
                  <FormControlLabel key={i + 1} value={i + 1} control={<Radio />} label={String(i + 1)} />
                ))}
              </RadioGroup>
            </FormControl>
            <TextField label="4. Apakah ada saran atau masukan untuk perbaikan?" name="saran_masukan" fullWidth margin="normal" multiline rows={4} onChange={handleChange} />
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button type="submit" variant="contained" size="large" disabled={loading || !!success}>
                {loading ? 'Mengirim...' : 'Kirim Feedback'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;