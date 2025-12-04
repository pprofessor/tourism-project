import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  open,
  onClose,
  onLoginClick,
}) => {
  const [step, setStep] = useState<"email" | "verify" | "success">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRequestReset = async () => {
    if (!email) {
      setMessage({ type: "error", text: "ایمیل الزامی است" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStep("verify");
        setMessage({
          type: "success",
          text: "کد بازیابی به ایمیل شما ارسال شد",
        });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در ارسال درخواست" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "تمام فیلدها الزامی هستند" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "رمز عبور باید حداقل ۶ کاراکتر باشد" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "رمز عبور و تکرار آن مطابقت ندارند" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStep("success");
        setMessage({ type: "success", text: "رمز عبور با موفقیت تغییر کرد" });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در تغییر رمز عبور" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          بازیابی رمز عبور
        </Typography>
      </DialogTitle>

      <DialogContent>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {step === "email" && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              کد بازیابی به این ایمیل ارسال خواهد شد
            </Typography>
          </Box>
        )}

        {step === "verify" && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="کد تأیید"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="رمز عبور جدید"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="تکرار رمز عبور جدید"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </Box>
        )}

        {step === "success" && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ رمز عبور با موفقیت تغییر کرد
            </Typography>
            <Typography variant="body2">
              اکنون می‌توانید با رمز عبور جدید وارد شوید
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        {step !== "success" && (
          <Button onClick={handleClose} disabled={loading}>
            انصراف
          </Button>
        )}

        {step === "email" && (
          <Button
            onClick={handleRequestReset}
            variant="contained"
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ارسال کد بازیابی"}
          </Button>
        )}

        {step === "verify" && (
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={loading}
          >
            {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
          </Button>
        )}

        {step === "success" && (
          <Button
            onClick={() => {
              handleClose();
              onLoginClick();
            }}
            variant="contained"
          >
            ورود به سیستم
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
