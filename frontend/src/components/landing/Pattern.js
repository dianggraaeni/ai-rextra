import React from 'react';
import styled from '@emotion/styled';

const Pattern = () => {
  return (
    <StyledWrapper aria-hidden="true">
      <div className="grid-wrapper">
        <div className="grid-background" />
        <div className="soft-vignette" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Make the pattern fill the parent (the section) and sit behind content */
  position: absolute;
  inset: 0;
  z-index: 0;

  .grid-wrapper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Gradient matching the attached colors (left-to-right / diagonal) */
    background: linear-gradient(180deg, #090B72 0%, #064ADF 45%, #23DCE1 100%);
  }

  /* Subtle grid overlay on top of the gradient */
  .grid-background {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    /* two-layer grid: fine lines + major grid lines */
    background-image:
      /* fine grid (every 24px) */
      linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
      /* major grid (every 120px) */
      linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 24px 24px, 24px 24px, 120px 120px, 120px 120px;
    background-position: 0 0, 0 0, 0 0, 0 0;
    mix-blend-mode: normal;
    opacity: 0.98;
    /* no mask so grid is visible across the hero */
    -webkit-mask-image: none;
    mask-image: none;
  }

  /* Soft vignette to add depth (subtle darkening at edges) */
  .soft-vignette {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    /* subtle downward light with a gentle dark center to match mock */
    background: radial-gradient(closest-side at 50% 100%, rgba(255,255,255,0.08), transparent 36%),
                radial-gradient(ellipse at center, rgba(0,0,0,0.10), transparent 60%);
    mix-blend-mode: multiply;
    opacity: 0.95;
  }
`;

export default Pattern;