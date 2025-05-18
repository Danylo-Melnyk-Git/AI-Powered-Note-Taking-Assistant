import React from 'react';
import { Skeleton, Box } from '@mui/material';

// Skeleton loader for loading state
export default function SkeletonLoader({ lines = 3, width = '100%', height = 32 }) {
  return (
    <Box>
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" width={width} height={height} sx={{ mb: 1 }} />
      ))}
    </Box>
  );
}
