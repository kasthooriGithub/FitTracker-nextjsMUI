"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateDailyCalories,
} from "@/utils/bmiCalculator";

export default function BMISetupModal({ open, onClose, onSave, profile }) {
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setHeightCm(profile?.height_cm || "");
    setWeightKg(profile?.weightKg || "");
    setAge(profile?.age || "");
    setGender(profile?.gender || "male");
    setGoal(profile?.goal || "");
    setErrors({});
  }, [open, profile]);

  const validate = () => {
    const e = {};
    if (!heightCm || Number(heightCm) <= 0) e.heightCm = "Please enter a valid height";
    if (!weightKg || Number(weightKg) <= 0) e.weightKg = "Please enter a valid weight";
    if (!age || Number(age) <= 0) e.age = "Please enter a valid age";
    if (!goal) e.goal = "Please select your fitness goal";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      const a = parseInt(age, 10);

      const bmi = calculateBMI(w, h);
      const bmiCategory = getBMICategory(bmi);
      const bmr = calculateBMR(w, h, a, gender);
      const dailyCalories = calculateDailyCalories(bmr, goal);

      await onSave({
        height_cm: h,
        weightKg: w,
        age: a,
        gender,
        goal,
        bmi,
        bmi_category: bmiCategory,
        bmr: Math.round(bmr),
        daily_calories_goal: dailyCalories,
        calories_calculated: true,
      });

      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Complete Your Profile</DialogTitle>

      <DialogContent dividers>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          We need a few details to calculate your BMI and daily calorie needs.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Height (cm)"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              error={!!errors.heightCm}
              helperText={errors.heightCm || " "}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              error={!!errors.weightKg}
              helperText={errors.weightKg || " "}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={!!errors.age}
              helperText={errors.age || " "}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              fullWidth
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Fitness Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              error={!!errors.goal}
              helperText={errors.goal || " "}
              fullWidth
            >
              <MenuItem value="">Select your goal...</MenuItem>
              <MenuItem value="lose_weight">Lose Weight</MenuItem>
              <MenuItem value="gain_weight">Gain Weight</MenuItem>
              <MenuItem value="maintain">Maintain Weight</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 999, fontWeight: 900, px: 3 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={!saving ? <FitnessCenterRoundedIcon /> : null}
          sx={{ borderRadius: 999, fontWeight: 900, px: 3, backgroundColor: "primary.main", color: "white" }}
        >
          {saving ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            "Save & Calculate BMI"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
