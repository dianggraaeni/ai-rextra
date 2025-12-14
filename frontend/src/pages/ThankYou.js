import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, Divider } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 720,
  margin: '0 auto',
  borderRadius: '16px',
  // solid white card with subtle border and shadow for clarity on white background
  background: '#ffffff',
  border: '1px solid rgba(2,6,23,0.04)',
  boxShadow: '0 8px 30px rgba(2,6,23,0.06)',
  color: '#0f172a',
  // ensure large screens fit in one viewport: cap height and hide overflow
  '@media (min-width: 900px)': {
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  },
}));

const ThankYou = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const steps = [
    {
      title: 'Kunjungi REXTRA.id',
      description: 'Buka https://rextra.id melalui browser favoritmu untuk mulai menggunakan layanan.',
      icon: '🌐',
    },
    {
      title: 'Pilih Mulai Tes Sekarang',
      description: 'Klik tombol “Mulai Tes Sekarang” di halaman utama untuk masuk ke halaman verifikasi premium.',
      icon: '🧭',
    },
    {
      title: 'Masukkan Hashcode Premium',
      description: 'Salin hashcode unik yang kamu terima dan tempelkan pada kolom verifikasi untuk membuka akses Premium.',
      icon: '🔐',
    },
    {
      title: 'Eksplorasi Fitur Premium',
      description: 'Nikmati seluruh fitur eksklusif seperti laporan detail, insight mendalam, dan hasil yang dapat dibagikan.',
      icon: '🚀',
    },
  ];

  const premiumPerks = [
    'Laporan PDF lengkap & siap dibagikan',
    'Insight khusus mahasiswa & rekomendasi personal',
    'Komparasi profesi dan roadmap skill lanjutan',
    'Akses ulang kapan pun dengan hashcode yang sama',
  ];

  // extract inner content so we can render it inside a Card on small screens or plain Box on desktop
  const renderInner = () => (
    <>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 1.5 } }}>

        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#00203f', fontSize: { xs: '1.25rem', md: '1rem' } }}>
          🎉 Terima Kasih!
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(15,23,42,0.8)', lineHeight: 1.4, fontSize: { xs: '0.95rem', md: '0.85rem' } }}>
          Kamu sudah berlangganan Premium Plan REXTRA. Selamat menikmati fitur lengkap untuk mendukung persiapan kariermu!
        </Typography>
      </Box>

      {/* Cara Menggunakan */}
      <Box sx={{ mb: { xs: 4, md: 2 }, textAlign: 'left' }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: '700', color: '#212529', fontSize: { xs: '1rem', md: '0.95rem' } }}>
          Cara Menggunakan Premium Plan
        </Typography>
        <Box
          sx={{
            background: '#fff',
            borderRadius: 3,
            p: { xs: 2, md: 1.25 },
            border: '1px solid rgba(2,6,23,0.04)',
          }}
        >
          <Grid container spacing={2.5}>
            {steps.map((step, index) => (
              <Grid item xs={12} key={step.title}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 2, md: 1.25 },
                    p: { xs: 1.5, md: 1 },
                    borderRadius: 2,
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(2,6,23,0.04)',
                    boxShadow: '0 4px 12px rgba(2,6,23,0.03)',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.25rem', md: '1rem' },
                      background: 'linear-gradient(135deg, #2971F7 0%, #2C3B8E 100%)',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: { xs: '0.95rem', md: '0.9rem' } }}>
                      {step.icon} {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(15,23,42,0.75)', lineHeight: 1.4, fontSize: { xs: '0.9rem', md: '0.8rem' } }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: { xs: 2.5, md: 1.5 }, borderColor: 'rgba(2,6,23,0.06)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: { xs: 1, md: 0.75 }, fontSize: { xs: '1rem', md: '0.9rem' } }}>
            Fitur Premium yang Bisa Kamu Nikmati:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 1 } }}>
            {premiumPerks.map((perk) => (
              <Box
                key={perk}
                sx={{
                  px: { xs: 2, md: 1.25 },
                  py: { xs: 1, md: 0.5 },
                  borderRadius: 2,
                  backgroundColor: 'rgba(37, 99, 235, 0.06)',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', md: '0.78rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span role="img" aria-label="perk">✨</span>
                {perk}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Tips */}
      <Box sx={{ mb: { xs: 3, md: 2 }, p: { xs: 2, md: 1.25 }, borderRadius: 1, background: '#f8fbff', borderLeft: 3, borderColor: '#23DCE1' }}>
        <Typography variant="body2" sx={{ fontWeight: '700', color: '#0f172a', mb: 0.5, fontSize: { xs: '0.95rem', md: '0.85rem' } }}>
          💡 Tips:
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(15,23,42,0.8)', fontSize: { xs: '0.9rem', md: '0.82rem' } }}>
          Simpan hashcode dengan baik, karena diperlukan untuk mengakses fitur Premium Plan dengan rextra.id/result/:hash
        </Typography>
      </Box>

      {/* Support Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#6c757d', lineHeight: 1.5 }}>
          Jika ada pertanyaan atau kendala, tim support kami siap membantu melalui Whatsapp ini (+62 851-1724-2155).
        </Typography>
      </Box>

      {/* Signature */}
      <Typography variant="body2" sx={{ fontWeight: '700', color: 'rgba(15,23,42,0.85)', mb: { xs: 3, md: 2 }, fontSize: { xs: '0.95rem', md: '0.88rem' } }}>
        — Tim REXTRA
      </Typography>

      <Button
        variant="contained"
        size="medium"
        onClick={() => navigate('/test-riasec')}
        sx={{
          px: { xs: 5, md: 4 },
          py: { xs: 1.25, md: 1 },
          fontSize: { xs: '0.95rem', md: '0.85rem' },
          fontWeight: 700,
          borderRadius: '10px',
          color: '#fff',
          background: 'linear-gradient(90deg, #0057FF 0%, #2971F7 100%)',
          boxShadow: '0 8px 24px rgba(41,113,247,0.12)',
        }}
      >
        Mulai Tes RIASEC
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 5 },
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {isDesktop ? (
          // desktop: no card, allow full-width content inside container
          <Box sx={{ background: 'transparent', p: { xs: 2, md: 3 } }}>
            {renderInner()}
          </Box>
        ) : (
          // mobile: keep card
          <StyledCard>
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center' }}>{renderInner()}</CardContent>
          </StyledCard>
        )}
      </Container>
    </Box>
  );
};

export default ThankYou;