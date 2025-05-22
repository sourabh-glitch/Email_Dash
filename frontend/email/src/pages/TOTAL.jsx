import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Divider
} from '@mui/material';

const TOTAL = () => {
  const theme = useTheme();

  const serverLabels = ['LOFO1', 'LOFO2', 'LOFO3', 'LOFO4'];
  const diskUsage = [60, 80, 45, 55];
  const memoryUsage = [40, 70, 55, 60];

  return (
    <Card
      elevation={6}
      sx={{
        m: 2,
        p: 2,
        borderRadius: '16px',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight={600}
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          Server Resource Usage
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          Comparison of Disk and Memory usage across servers.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ overflowX: 'auto', pb: 1 }}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: serverLabels }]}
            series={[
              {
                label: 'Disk Usage (%)',
                data: diskUsage,
                color: theme.palette.primary.main,
              },
              {
                label: 'Memory Usage (%)',
                data: memoryUsage,
                color: theme.palette.success.main,
              },
            ]}
            width={640}
            height={320}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TOTAL;
