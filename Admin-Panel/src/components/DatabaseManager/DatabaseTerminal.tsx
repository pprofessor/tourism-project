import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { PlayArrow, Clear } from '@mui/icons-material';

const DatabaseTerminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const predefinedCommands = [
    { command: 'SELECT * FROM users;', description: 'نمایش تمام کاربران' },
    { command: 'SELECT COUNT(*) FROM hotels;', description: 'تعداد هتل‌ها' },
    { command: 'UPDATE users SET role = ? WHERE id = ?;', description: 'تغییر نقش کاربر' },
    { command: 'DELETE FROM slides WHERE id = ?;', description: 'حذف اسلاید' },
    { command: 'BACKUP DATABASE tourism_db;', description: 'پشتیبان‌گیری' }
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    setOutput(prev => [...prev, `$ ${command}`]);

    // شبیه‌سازی اجرای دستور
    setTimeout(() => {
      const response = `نتیجه اجرای دستور: "${command}"\nتعداد رکوردهای تأثیرپذیر: ${Math.floor(Math.random() * 10)}`;
      setOutput(prev => [...prev, response, '---']);
      setCommand('');
      setIsLoading(false);
    }, 1000);
  };

  const clearTerminal = () => {
    setOutput([]);
  };

  const handlePredefinedCommand = (cmd: string) => {
  setCommand(cmd);
  };

  return (
    <Box>
      {/* ترمینال */}
      <Paper 
        ref={terminalRef}
        sx={{
          height: 400,
          bgcolor: 'black',
          color: 'lime',
          p: 2,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          mb: 2
        }}
      >
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {isLoading && <CircularProgress size={16} sx={{ color: 'lime', ml: 1 }} />}
      </Paper>

      {/* دستورات از پیش تعریف شده */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          دستورات سریع:
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {predefinedCommands.map((item, index) => (
  <Chip
    key={index}
    label={`${item.command} - ${item.description}`}
    onClick={() => handlePredefinedCommand(item.command)}
    variant="outlined"
    size="small"
  />
))}
        </Box>
      </Box>

      {/* ورودی دستور */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="دستور SQL خود را وارد کنید..."
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={executeCommand}
          disabled={isLoading || !command.trim()}
          startIcon={<PlayArrow />}
        >
          اجرا
        </Button>
        <Button
          variant="outlined"
          onClick={clearTerminal}
          startIcon={<Clear />}
        >
          پاک کردن
        </Button>
      </Box>

      <Alert severity="info">
        توجه: این ترمینال برای اجرای دستورات مستقیم روی دیتابیس است. قبل از اجرا مطمئن شوید.
      </Alert>
    </Box>
  );
};

export default DatabaseTerminal;