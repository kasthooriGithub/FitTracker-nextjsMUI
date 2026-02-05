"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err) {
      setErrorText(err?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
      }}
    >
      {/* LEFT (Blue branding) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 8, lg: 10 },
          color: "white",
          background: "linear-gradient(135deg, rgb(19, 76, 156) 0%, rgb(8, 40, 95) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2), transparent 50%)",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 560 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.18)",
                display: "grid",
                placeItems: "center",
                backdropFilter: "blur(6px)",
              }}
            >
              <ShowChartRoundedIcon sx={{ color: "white" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 950 }}>
              FitTrack
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 64,
              fontWeight: 950,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              mb: 3,
            }}
          >
            Your Personal
            <br />
            Fitness Journey
            <br />
            Starts Here
          </Typography>

          <Typography sx={{ opacity: 0.85, fontSize: 18, maxWidth: 520 }}>
            Track workouts, monitor progress, and achieve your health goals with our intuitive
            fitness companion.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT (Card centered perfectly) */}
      <Box
        sx={{
          bgcolor: "#F6F7FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 18px 55px rgba(12, 24, 45, 0.10)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 950, mb: 0.5 }}>
            {isLogin ? "Welcome back" : "Create an account"}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            {isLogin
              ? "Enter your credentials to access your dashboard"
              : "Start your fitness journey today"}
          </Typography>

          {/* Error */}
          {errorText ? (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "rgba(239,68,68,0.10)",
                color: "rgb(185,28,28)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {errorText}
            </Box>
          ) : null}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            {!isLogin && (
              <TextField
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ minLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass((v) => !v)} edge="end">
                      {showPass ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="text"
                sx={{ textTransform: "none", color: "text.secondary", px: 0 }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={!loading ? <ArrowForwardRoundedIcon /> : null}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 900,
                textTransform: "none",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  Loading...
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>

          {/* Toggle */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              type="button"
              onClick={() => {
                setIsLogin((v) => !v);
                setErrorText("");
              }}
              sx={{ textTransform: "none", color: "text.secondary", fontWeight: 800 }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
