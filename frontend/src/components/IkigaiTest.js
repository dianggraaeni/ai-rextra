import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, FormGroup,
  FormControlLabel, FormControl, Paper, TextField, FormLabel, Checkbox, CircularProgress, Alert
} from '@mui/material';

const IkigaiTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('/api/assessment/start')
      .then(response => {
        // Langsung ambil array dari kunci 'ikigai_questions'
        const ikigaiQuestions = response.data.ikigai_questions || [];
        setQuestions(ikigaiQuestions);

        // Inisialisasi state jawaban berdasarkan pertanyaan yang diterima
        const initialAnswers = {};
        ikigaiQuestions.forEach(q => {
          initialAnswers[q.dimension] = { choices: [], reason: '', alternative: '' };
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal memulai tes IKIGAI. Harap selesaikan tes RIASEC terlebih dahulu.');
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (dimension, option) => {
    setAnswers(prev => {
      const currentChoices = prev[dimension].choices;
      let newChoices;
      if (currentChoices.includes(option)) {
        newChoices = currentChoices.filter(item => item !== option);
      } else {
        newChoices = [...currentChoices, option].slice(0, 2); // Batasi maks 2 pilihan
      }
      return {
        ...prev,
        [dimension]: { ...prev[dimension], choices: newChoices }
      };
    });
  };

  const handleTextChange = (dimension, field, value) => {
    setAnswers(prev => ({
      ...prev,
      [dimension]: { ...prev[dimension], [field]: value }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validasi tetap sama
    for (const key in answers) {
      const answer = answers[key];
      const hasChoices = answer.choices.length > 0;
      const hasReason = answer.reason.trim() !== '';
      const hasAlternative = answer.alternative.trim() !== '';

      if (hasChoices && !hasReason) {
        setError(`Harap isi alasan untuk pilihan Anda di dimensi "${key}".`);
        return;
      }
      if (!hasChoices && !hasAlternative) {
        setError(`Jika tidak ada yang cocok, harap tuliskan alternatif untuk dimensi "${key}".`);
        return;
      }
    }

    setError('');
    setSubmitting(true);

    axios.post('/api/assessment/submit', { answers })
      .then(response => {
        // **PERBAIKAN: Kirim seluruh data respons ke halaman hasil**
        // Ini memastikan semua data (hasil analisis, profil, grafik) terbawa
        
        console.log('Submit response:', response.data); // Debug response
        navigate('/results', { state: { finalResponse: response.data } });
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal mengirim jawaban. Silakan coba lagi.');
        setSubmitting(false);
      });
  };

  const renderQuestionBlock = (question) => (
    <Box component={Paper} elevation={2} sx={{ p: 3, mb: 4 }} key={question.dimension}>
      <FormControl component="fieldset" fullWidth required>
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
          {question.instruction}
        </FormLabel>
        <FormGroup>
          {question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={answers[question.dimension]?.choices.includes(option)}
                  onChange={() => handleCheckboxChange(question.dimension, option)}
                  disabled={answers[question.dimension]?.choices.length >= 2 && !answers[question.dimension]?.choices.includes(option)}
                />
              }
              label={option}
              sx={{ mb: 1 }}
            />
          ))}
        </FormGroup>
        {answers[question.dimension]?.choices.length > 0 ? (
          <TextField
            fullWidth multiline rows={3}
            label="Jelaskan mengapa pilihan ini sesuai dengan Anda."
            value={answers[question.dimension]?.reason || ''}
            onChange={(e) => handleTextChange(question.dimension, 'reason', e.target.value)}
            sx={{ mt: 3 }} required
          />
        ) : (
          <TextField
            fullWidth multiline rows={3}
            label="Tidak ada yang cocok? Tuliskan preferensi ideal Anda di sini."
            value={answers[question.dimension]?.alternative || ''}
            onChange={(e) => handleTextChange(question.dimension, 'alternative', e.target.value)}
            sx={{ mt: 3 }} required
          />
        )}
      </FormControl>
    </Box>
  );

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Memuat Tes IKIGAI...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary.main" sx={{ fontWeight: 'bold' }}>
          Tes IKIGAI
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 3 }}>
          Tes ini bertujuan membantu menemukan profesi yang paling sesuai. Tidak ada jawaban benar atau salah.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {questions.length > 0 ? (
          <form onSubmit={handleSubmit}>
            {questions.map((q) => renderQuestionBlock(q))}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Selesai & Lihat Hasil Analisis'}
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

export default IkigaiTest;