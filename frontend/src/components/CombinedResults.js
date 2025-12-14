import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Box, Paper, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  '@media print': {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    pageBreakInside: 'avoid',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  height: '100%',
  border: '1px solid #e9ecef',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  '@media print': {
    boxShadow: 'none',
    pageBreakInside: 'avoid',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  height: '100%',
  border: '2px solid #007bff',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,123,255,0.2)',
  },
  '@media print': {
    boxShadow: 'none',
    pageBreakInside: 'avoid',
  },
}));

const SkillCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  height: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid #dee2e6',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  '@media print': {
    boxShadow: 'none',
    pageBreakInside: 'avoid',
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  '@media print': {
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    pageBreakInside: 'avoid',
    marginBottom: theme.spacing(2),
  },
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
  backgroundColor: priority === 'High' ? '#dc3545' : '#ffc107',
  color: priority === 'High' ? 'white' : '#212529',
  fontWeight: 'bold',
  borderRadius: '6px',
}));

const CommitmentChip = styled(Chip)(({ level }) => ({
  backgroundColor: 
    level === 'High' ? '#dc3545' :
    level === 'Medium' ? '#ffc107' : '#28a745',
  color: 
    level === 'High' ? 'white' :
    level === 'Medium' ? '#212529' : 'white',
  fontWeight: 'bold',
  borderRadius: '6px',
}));

// Enhanced Interactive Chart Component
const InteractiveChart = ({ chartData }) => {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = React.useState(null);
  const [tooltip, setTooltip] = React.useState({ show: false, x: 0, y: 0, value: '', label: '' });

  useEffect(() => {
    if (!chartData || !chartData.labels || !chartData.data || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the drawing context so everything will work at the higher ratio
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(79, 172, 254, 0.05)');
    gradient.addColorStop(1, 'rgba(79, 172, 254, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid circles with different styles
    const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0];
    gridLines.forEach((ratio, index) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * ratio, 0, 2 * Math.PI);
      
      if (index === gridLines.length - 1) {
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = `rgba(224, 224, 224, ${0.3 + ratio * 0.4})`;
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // Add value labels on circles
      if (index < gridLines.length - 1) {
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((ratio * 100).toFixed(0), centerX, centerY - radius * ratio + 3);
      }
    });

    // Calculate points and draw axes
    const points = [];
    const angleStep = (2 * Math.PI) / chartData.labels.length;
    
    chartData.labels.forEach((label, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = chartData.data[i] || 0;
      const distance = (radius * value) / 100;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      
      points.push({ x, y, value, label, angle, distance });

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.strokeStyle = 'rgba(224, 224, 224, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw labels with better positioning
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const labelDistance = radius + 30;
      const labelX = centerX + labelDistance * Math.cos(angle);
      const labelY = centerY + labelDistance * Math.sin(angle);
      
      // Add background to labels for better readability
      const textMetrics = ctx.measureText(label);
      const padding = 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(
        labelX - textMetrics.width / 2 - padding,
        labelY - 8 - padding,
        textMetrics.width + padding * 2,
        16 + padding * 2
      );
      
      ctx.fillStyle = '#333';
      ctx.fillText(label, labelX, labelY);
    });

    // Draw data area with gradient
    if (points.length > 0) {
      ctx.beginPath();
      points.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();

      // Fill with gradient
      const dataGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      dataGradient.addColorStop(0, 'rgba(79, 172, 254, 0.4)');
      dataGradient.addColorStop(1, 'rgba(79, 172, 254, 0.1)');
      ctx.fillStyle = dataGradient;
      ctx.fill();

      // Stroke the border
      ctx.strokeStyle = '#4facfe';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw data points with hover effects
    points.forEach((point, i) => {
      const isHovered = hoveredPoint === i;
      const pointRadius = isHovered ? 8 : 6;
      
      // Shadow for points
      ctx.shadowColor = 'rgba(79, 172, 254, 0.5)';
      ctx.shadowBlur = isHovered ? 10 : 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Outer ring
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius + 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Inner point
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isHovered ? '#2575fc' : '#4facfe';
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Value labels on hover
      if (isHovered) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.value.toFixed(1), point.x, point.y - pointRadius - 15);
      }
    });

  }, [chartData, hoveredPoint]);

  // Handle mouse events for interactivity
  const handleMouseMove = (event) => {
    if (!canvasRef.current || !chartData) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 2 - 60;

    // Check if mouse is over any data point
    let foundHover = false;
    const angleStep = (2 * Math.PI) / chartData.labels.length;
    
    chartData.data.forEach((value, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const distance = (radius * value) / 100;
      const pointX = centerX + distance * Math.cos(angle);
      const pointY = centerY + distance * Math.sin(angle);
      
      const dist = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
      
      if (dist < 15) { // Hover radius
        setHoveredPoint(i);
        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          value: value.toFixed(1),
          label: chartData.labels[i]
        });
        foundHover = true;
      }
    });

    if (!foundHover) {
      setHoveredPoint(null);
      setTooltip({ show: false, x: 0, y: 0, value: '', label: '' });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltip({ show: false, x: 0, y: 0, value: '', label: '' });
  };

  if (!chartData || !chartData.labels || !chartData.data) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Chart data tidak tersedia
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#2575fc', fontWeight: 'bold' }}>
        Grafik Skor RIASEC Anda
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Hover pada titik data untuk melihat detail skor
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            width: '400px',
            height: '400px',
            maxWidth: '100%',
            cursor: hoveredPoint !== null ? 'pointer' : 'default',
            border: '2px solid #e3f2fd',
            borderRadius: '12px',
            backgroundColor: '#fafafa',
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.1)'
          }}
        />
        
        {/* Tooltip */}
        {tooltip.show && (
          <Box
            sx={{
              position: 'fixed',
              left: tooltip.x + 10,
              top: tooltip.y - 40,
              backgroundColor: 'rgba(37, 117, 252, 0.95)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '100%',
                left: '50%',
                marginLeft: '-5px',
                borderWidth: '5px',
                borderStyle: 'solid',
                borderColor: 'rgba(37, 117, 252, 0.95) transparent transparent transparent'
              }
            }}
          >
            {tooltip.label}: {tooltip.value}%
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        {chartData.labels.map((label, index) => (
          <Box
            key={label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '20px',
              backgroundColor: hoveredPoint === index ? '#e3f2fd' : '#f5f5f5',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                transform: 'translateY(-2px)'
              }
            }}
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#4facfe',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 'medium', color: '#333' }}>
              {label}: {chartData.data[index]?.toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const CombinedResults = ({ initialData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultsData, finalResponse } = location.state || {};
  
  // Handle both possible data keys or props
  const data = initialData || resultsData || finalResponse;

  // Additional data states
  const [skillRoadmap, setSkillRoadmap] = React.useState(null);
  const [dominantType, setDominantType] = React.useState(null);
  const [campusActivities, setCampusActivities] = React.useState(null);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = React.useState(null);
  const [loadingAdditional, setLoadingAdditional] = React.useState(false);
  const [generatingPDF, setGeneratingPDF] = React.useState(false);

  // Load additional data if not present
  React.useEffect(() => {
    if (!data || !data.profile) return;

    // If additional_data already exists, use it
    if (data.additional_data) {
      setSkillRoadmap(data.additional_data.skill_roadmap);
      setDominantType(data.additional_data.dominant_type);
      setCampusActivities(data.additional_data.campus_activities);
      setStrengthsWeaknesses(data.additional_data.strengths_weaknesses);
      return;
    }

    const loadAdditionalData = async () => {
      setLoadingAdditional(true);
      try {
        // Skill Roadmap
        const roadmapResponse = await axios.post("/api/skill-roadmap/", {
          riasec_code: data.profile,
          target_jobs: data.results?.top_2 || []
        });
        setSkillRoadmap(roadmapResponse.data);

        // Dominant Type
        const dominantResponse = await axios.post("/api/dominant-type/", {
          dominant_type: data.profile
        });
        setDominantType(dominantResponse.data);

        // Campus Activities
        const activitiesResponse = await axios.post("/api/campus-activities/", {
          riasec_code: data.profile,
          target_jobs: data.results?.top_2 || []
        });
        setCampusActivities(activitiesResponse.data);

        // Strengths & Weaknesses
        const swResponse = await axios.post("/api/strengths-weaknesses/", {
          riasec_code: data.profile
        });
        setStrengthsWeaknesses(swResponse.data);

      } catch (error) {
        console.error("Error loading additional data:", error);
      } finally {
        setLoadingAdditional(false);
      }
    };

    loadAdditionalData();
  }, [data]);

  // PDF Generation Function
  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;

      let currentY = margin; // Starting Y position from top margin

      // Function to add a section to PDF, always starting on a new page if it doesn't fit
      const addSectionToPDF = async (sectionElement) => {
        if (!sectionElement) return;

        // Temporarily modify the section for better capture
        const originalStyles = {
          width: sectionElement.style.width,
          maxWidth: sectionElement.style.maxWidth,
          boxShadow: sectionElement.style.boxShadow,
        };

        sectionElement.style.width = '1400px';
        sectionElement.style.maxWidth = 'none';
        sectionElement.style.boxShadow = 'none';

        try {
          const canvas = await html2canvas(sectionElement, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: sectionElement.scrollWidth,
            windowHeight: sectionElement.scrollHeight,
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // If the section doesn't fit, always start on a new page
          if (imgHeight > (pageHeight - 2 * margin)) {
            // Section is taller than a page, so scale it to fit one page
            pdf.addPage();
            currentY = margin;
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, pageHeight - 2 * margin, undefined, 'FAST');
            currentY = pageHeight; // Force next section to new page
          } else {
            if (currentY + imgHeight > pageHeight - margin) {
              pdf.addPage();
              currentY = margin;
            }
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight, undefined, 'FAST');
            currentY += imgHeight + 5;
          }

        } finally {
          // Restore original styles
          sectionElement.style.width = originalStyles.width;
          sectionElement.style.maxWidth = originalStyles.maxWidth;
          sectionElement.style.boxShadow = originalStyles.boxShadow;
        }
      };

      // Get all sections and add them one by one
      const sections = [
        'hero',
        'riasec-profile',
        'dominant-type',
        'chart',
        'career-recommendations',
        'skill-roadmap',
        'campus-activities',
        'strengths-weaknesses'
      ];

      for (const sectionName of sections) {
        const sectionElement = document.querySelector(`[data-pdf-section="${sectionName}"]`);
        if (sectionElement) {
          await addSectionToPDF(sectionElement);
        }
      }

      const fileName = `RIASEC_${data.profile}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF Error:', error);
      alert('Gagal membuat PDF. Error: ' + error.message);
    } finally {
      setGeneratingPDF(false);
    }
  };  if (!data) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5" color="error">Data hasil tidak ditemukan.</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Kembali ke Tes
        </Button>
      </Container>
    );
  }

  const { results, profile, riasec_explanations, riasec_map_full, chart_data, additional_data } = data;

  // Debug logging for frontend
  console.log('=== FRONTEND DEBUG ===');
  console.log('data:', data);
  console.log('chart_data:', chart_data);
  console.log('chart_data type:', typeof chart_data);
  console.log('chart_data.labels:', chart_data?.labels);
  console.log('chart_data.data:', chart_data?.data);
  console.log('=== END FRONTEND DEBUG ===');

  return (
    <>
  <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 10 }, pb: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* PDF Download Button */}
        <Box sx={{ textAlign: 'center', mb: 3 }} data-pdf-exclude="true">
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={generatePDF}
            disabled={generatingPDF}
            sx={{
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              borderColor: '#007bff',
              color: '#007bff',
              '&:hover': {
                backgroundColor: '#007bff',
                color: 'white'
              }
            }}
          >
            {generatingPDF ? 'Membuat PDF...' : 'Download PDF'}
          </Button>
        </Box>

        {/* PDF Content Wrapper */}
        <div data-pdf-content="true">
        {/* Hero Section */}
        <div data-pdf-section="hero">
        <StyledPaper elevation={0}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#212529', fontWeight: 'bold' }}>
              Hasil Tes RIASEC Anda
            </Typography>
            <Typography variant="h5" sx={{ color: '#495057', mb: 2 }}>
              Kode RIASEC: <Box component="span" sx={{ fontWeight: 'bold', color: '#007bff' }}>{profile}</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: '#6c757d' }}>
              Berikut adalah analisis mendalam tentang kepribadian dan rekomendasi karir Anda
            </Typography>
          </Box>
        </StyledPaper>
        </div>

        {/* RIASEC Profile Cards */}
        <div data-pdf-section="riasec-profile">
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
          Profil Kepribadian RIASEC
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {profile.split('').map((code) => (
            <Grid item xs={12} sm={6} md={4} key={code}>
              <ProfileCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: '#007bff', mb: 1 }}>
                    {riasec_map_full[code]} ({code})
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#495057', lineHeight: 1.6 }}>
                    {riasec_explanations[code]}
                  </Typography>
                </CardContent>
              </ProfileCard>
            </Grid>
          ))}
        </Grid>
        </div>

        {/* Dominant Type Explanation */}
        {dominantType && (
          <div data-pdf-section="dominant-type">
          <SectionPaper elevation={0}>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
              Penjelasan Tipe Dominan
            </Typography>
            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #dee2e6' }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#495057' }}>
                {dominantType.explanation}
              </Typography>
            </Box>
          </SectionPaper>
          </div>
        )}

        {/* Interactive Chart */}
        <div data-pdf-section="chart">
        <SectionPaper elevation={0}>
          <InteractiveChart chartData={chart_data} />
        </SectionPaper>
        </div>

        {/* Top 2 Career Recommendations */}
        <div data-pdf-section="career-recommendations">
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
          Rekomendasi Karir Teratas
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {results.top_2.map((professionName, index) => {
            const profData = results.analysis.find(p => p.profession === professionName);
            return (
              <Grid item xs={12} md={6} key={profData.profession}>
                <ResultCard>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: '#007bff', mb: 2 }}>
                      {index === 0 ? '🥇' : '🥈'} {profData.profession}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#007bff', mb: 2, fontSize: '2.5rem' }}>
                      {profData.match_percentage}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#495057', lineHeight: 1.6 }}>
                      {profData.reason}
                    </Typography>
                  </CardContent>
                </ResultCard>
              </Grid>
            );
          })}
        </Grid>
        </div>

      {/* Additional Data Sections */}
      {additional_data && (
        <>
            {/* Skill Roadmap */}
            {skillRoadmap && (
              <div data-pdf-section="skill-roadmap">
              <SectionPaper elevation={0}>
                <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
                  Roadmap Pengembangan Skill
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                    Hard Skills
                  </Typography>
                  <Grid container spacing={2}>
                    {skillRoadmap.hard_skills?.map((skill, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <SkillCard>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#212529' }}>
                                {skill.skill}
                              </Typography>
                              <PriorityChip label={skill.priority} priority={skill.priority} size="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                              {skill.description}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007bff', fontSize: '0.875rem' }}>
                              Langkah Aksi:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {skill.action_steps?.map((step, stepIndex) => (
                                <Typography component="li" variant="body2" color="text.secondary" key={stepIndex} sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                                  {step}
                                </Typography>
                              ))}
                            </Box>
                          </CardContent>
                        </SkillCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                    Soft Skills
                  </Typography>
                  <Grid container spacing={2}>
                    {skillRoadmap.soft_skills?.map((skill, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <SkillCard>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#212529' }}>
                                {skill.skill}
                              </Typography>
                              <PriorityChip label={skill.priority} priority={skill.priority} size="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                              {skill.description}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007bff', fontSize: '0.875rem' }}>
                              Langkah Aksi:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {skill.action_steps?.map((step, stepIndex) => (
                                <Typography component="li" variant="body2" color="text.secondary" key={stepIndex} sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                                  {step}
                                </Typography>
                              ))}
                            </Box>
                          </CardContent>
                        </SkillCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {skillRoadmap.roadmap_notes && (
                  <Box sx={{ p: 2, bgcolor: '#e7f3ff', borderRadius: 1, borderLeft: 3, borderColor: '#007bff' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007bff' }}>
                      Catatan Roadmap:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#495057', mt: 0.5 }}>
                      {skillRoadmap.roadmap_notes}
                    </Typography>
                  </Box>
                )}
              </SectionPaper>
              </div>
            )}          {/* Campus Activities */}
          {campusActivities && (
            <div data-pdf-section="campus-activities">
            <SectionPaper elevation={0}>
              <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
                Rekomendasi Aktivitas Kampus
              </Typography>

              {campusActivities.recommendations_summary && (
                <Box sx={{ p: 2, bgcolor: '#e7f3ff', borderRadius: 1, borderLeft: 3, borderColor: '#007bff', mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#007bff' }}>
                    Ringkasan Rekomendasi:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#495057', mt: 0.5 }}>
                    {campusActivities.recommendations_summary}
                  </Typography>
                </Box>
              )}

              {/* Activity Sections */}
              {[
                { title: 'Organisasi Kampus', data: campusActivities.organizational_activities },
                { title: 'Kompetisi & Event', data: campusActivities.competitions_events },
                { title: 'Project & Inisiatif', data: campusActivities.projects_initiatives },
                { title: 'Volunteer & Sosial', data: campusActivities.volunteer_social }
              ].map(({ title, data }, sectionIndex) => (
                data && data.length > 0 && (
                  <Box key={sectionIndex} sx={{ mb: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                      {title}
                    </Typography>
                    <Grid container spacing={2}>
                      {data.map((activity, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <SkillCard>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#212529' }}>
                                  {activity.activity}
                                </Typography>
                                <CommitmentChip label={activity.commitment_level} level={activity.commitment_level} size="small" />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                                {activity.description}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#28a745', fontSize: '0.875rem' }}>
                                Manfaat: {activity.benefits}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#007bff', fontSize: '0.875rem' }}>
                                Relevansi: {activity.relevance_to_jobs}
                              </Typography>
                            </CardContent>
                          </SkillCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )
              ))}
            </SectionPaper>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          {strengthsWeaknesses && (
            <div data-pdf-section="strengths-weaknesses">
            <SectionPaper elevation={0}>
              <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#212529', fontWeight: 'bold', mb: 3 }}>
                Kekuatan & Kelemahan
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#28a745', fontWeight: 'bold' }}>
                    Kekuatan
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {strengthsWeaknesses.strengths?.map((strength, index) => (
                      <Box key={index} sx={{ p: 2, bgcolor: '#d4edda', borderRadius: 1, borderLeft: 3, borderColor: '#28a745' }}>
                        <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#155724', mb: 0.5 }}>
                          {strength.strength}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#155724', lineHeight: 1.5 }}>
                          {strength.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Kelemahan
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {strengthsWeaknesses.weaknesses?.map((weakness, index) => (
                      <Box key={index} sx={{ p: 2, bgcolor: '#f8d7da', borderRadius: 1, borderLeft: 3, borderColor: '#dc3545' }}>
                        <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', color: '#721c24', mb: 0.5 }}>
                          {weakness.weakness}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#721c24', lineHeight: 1.5 }}>
                          {weakness.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </SectionPaper>
            </div>
          )}
        </>
      )}

      {loadingAdditional && (
        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Memuat data tambahan...
          </Typography>
        </Box>
      )}

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/feedback', { state: { resultsData: data } })}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3'
            }
          }}
        >
          Isi Feedback
        </Button>
      </Box>
        </div>
    </Container>
    </>
  );
};

export default CombinedResults;