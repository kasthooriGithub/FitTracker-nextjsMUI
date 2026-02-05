"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";


import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CalculateIcon from "@mui/icons-material/Calculate";
import CenterFocusWeakRoundedIcon from "@mui/icons-material/CenterFocusWeakRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BMISetupModal from "@/components/BMISetupModal";
import { useProfile } from "@/hooks/useProfile";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { useNutrition } from "@/hooks/useNutrition";
import { useWorkouts } from "@/hooks/useWorkouts";



export default function DashboardPage() { 
  const { profile, updateProfile } = useProfile();
  const { todayLog, updateLog } = useDailyLogs();
  const { totals: nutritionTotals } = useNutrition(); 
  const { todaysTotalCalories, todaysWorkouts, deleteWorkout, addWorkout, updateWorkout } = useWorkouts();
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  
  const [openBMI, setOpenBMI] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const incomplete = !profile.height_cm || !profile.weightKg || !profile.age || !profile.calories_calculated;
    if (incomplete) setOpenBMI(true);
  }, [profile]);

  const handleSaveProfileData = async (data) => {
    await updateProfile(data);
    setOpenBMI(false);
  };

  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    setWater(todayLog?.water_ml || 0);
    setSteps(todayLog?.steps || 0);
  }, [todayLog?.water_ml, todayLog?.steps]);

  const stepsBurned = useMemo(() => Math.round(steps * 0.04), [steps]);
  const burned = useMemo(() =>
     (todaysTotalCalories || 0) + stepsBurned,
     [todaysTotalCalories, stepsBurned]
    
    );

  const goal = profile?.daily_calories_goal || 2000;
  const eaten = nutritionTotals?.calories || 0;
  const net = eaten - burned;

  const progress = useMemo(() => {
    if (!goal || goal <= 0) return 0;
    const pct = Math.round((eaten / goal) * 100);
    return Math.max(0, Math.min(100, pct));
  }, [eaten, goal]);
  

  const syncWater = (val) => {
    setWater(val);
    updateLog("water_ml", val);
  };
  const syncSteps = (val) => {
    setSteps(val);
    updateLog("steps", val);
  };

  const handleEditWorkout = (workout) => {
  setEditingWorkout(workout);
  setWorkoutDialogOpen(true);
  };

  const handleDeleteWorkout = async (id) => {
    await deleteWorkout(id);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const firstName = profile?.full_name?.split(" ")?.[0] || "there";

  const bmi = profile?.bmi;
  const bmiCategory = profile?.bmi_category;
  const goalLabel = profile?.goal === "lose_weight" ? "Weight Loss" : profile?.goal === "gain_weight" ? "Gain Weight" : profile?.goal === "maintain" ? "Maintain" : "—";

  const bmiChipColor = bmiCategory?.toLowerCase?.() === "normal" ? "success" : bmiCategory?.toLowerCase?.().includes("over") ? "warning" : bmiCategory?.toLowerCase?.().includes("obese") ? "error" : "info";
      
  const stepsGoal = profile?.daily_steps_goal || 10000;
  const waterGoal = profile?.daily_water_goal_ml || 2000;
  
  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Greeting */}
      <Typography sx={{ fontSize: { xs: 34, md: 54 }, fontWeight: 950, letterSpacing: "-0.02em", color: "#0f172a" }}>
        {greeting()}, {firstName}!
      </Typography>
      <Typography sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
        Here's your fitness snapshot for today
      </Typography>

      {/* 1. DAILY SUMMARY */}
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <IconBox><ShowChartRoundedIcon color="primary" /></IconBox>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 16 }}>DAILY SUMMARY</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Net Calories & Activity</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
            <SummaryTile title="EATEN" value={eaten} unit="kcal" icon={<RestaurantRoundedIcon />} color="#2563eb" />
            <SummaryTile title="BURNED" value={burned} unit="kcal" icon={<WhatshotRoundedIcon />} color="#f59e0b" />
            <SummaryTile title="NET" value={net} unit="In - Out" icon={<ShowChartRoundedIcon />} color="#06b6d4" />
            <SummaryTile title="GOAL" value={goal} unit="kcal" icon={<CenterFocusWeakRoundedIcon />} color="#16a34a" />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Progress towards goal</Typography>
              <Typography sx={{ fontWeight: 800, color: "primary.main" }}>{progress}%</Typography>
            </Box>
            <LinearProgress value={progress} variant="determinate" sx={{ height: 8, borderRadius: 4 }} />
            <Box sx={infoBoxStyle}>
              <InfoRoundedIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                You can consume ~{Math.max(0, goal - eaten)} more kcal today to reach your goal.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      
      {/* 2. YOUR CALORIE PLAN  */}
<Card sx={{ ...cardStyle, mt: 2 }}>
  <CardContent sx={{ p: 2 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
          YOUR CALORIE PLAN
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
          Daily target & BMI snapshot
        </Typography>
      </Box>

      <IconButton
        onClick={() => setOpenBMI(true)}
        sx={{ borderRadius: 2, border: "1px solid #e2e8f0" ,color: "text.secondary" }}
      >
        <CalculateRoundedIcon fontSize="small" />
      </IconButton>
    </Box>

    {/*  MiniStat */}
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",            
          sm: "1fr 1fr",        
          md: "repeat(3, 1fr)", 
        },
        alignItems: "stretch",
      }}
    >
      <MiniStat label="Daily Target" value={goal} unit="kcal" />
      <MiniStat label="Goal" value={goalLabel} isGoal />
      <MiniStat
        label="BMI"
        value={bmi ? bmi.toFixed(1) : "—"}
        chipLabel={bmiCategory}
        chipColor={bmiChipColor}
      />
    </Box>

    <Box
      sx={{
        mt: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: "#09152226",
        textAlign: "center",
        fontWeight: 700,
        color: "text.secondary",
        fontSize: 13,
      }}
    >
      Target Weight: {profile?.target_weight_kg || "—"} kg | Current:{" "}
      {profile?.weightKg || "—"} kg
    </Box>
  </CardContent>
</Card>


      {/* 3. YOUR BMI  */}
      <Card sx={{ ...cardStyle, mt: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <IconBox><ShowChartRoundedIcon color="primary" /></IconBox>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 16 }}>YOUR BMI</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Body Mass Index</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: 38, fontWeight: 950 }}>{bmi ? bmi.toFixed(1) : "—"}</Typography>
            <Chip label={bmiCategory || "Not set"} color={bmiChipColor} sx={{ fontWeight: 800 }} />
          </Box>
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: "#f8fafc", border: "1px solid rgba(15,23,42,0.04)" }}>
            <Typography sx={{ fontWeight: 800, fontSize: 14 }}> Recommendation: <span style={{ fontWeight: 600, color: "#64748b" }}>Maintain a slight calorie deficit with regular cardio and strength training.</span></Typography>
            <Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>This is general advice, not medical guidance.</Typography>
          </Box>
        </CardContent>
      </Card>

      

      {/* 5. DAILY SNAPSHOT  */}
<Card sx={{ ...cardStyle, mt: 2 }}>
  <CardContent sx={{ p: 2 }}>
    <Typography sx={{ fontWeight: 900, fontSize: 14, mb: 2 }}>
      DAILY SNAPSHOT
    </Typography>

    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",            
          sm: "1fr 1fr",        
          md: "repeat(3, 1fr)", 
        },
        alignItems: "stretch",
      }}
    >
      <ProgressRing
        title="Steps"
        value={todayLog?.steps || 0}
        goal={stepsGoal}
        unit=""
        color="#2563eb"
      />

      <ProgressRing
        title="Water"
        value={Number(((todayLog?.water_ml || 0) / 1000).toFixed(1))}
        goal={Number((waterGoal / 1000).toFixed(1))}
        unit="L"
        color="#10b981"
      />

      <ProgressRing
        title="Burned"
        value={burned}
        goal={goal}
        unit=""
        color="#f59e0b"
      />
    </Box>
  </CardContent>
</Card>


{/* 4. QUICK LOGS */}
<Box
  sx={{
    display: "flex",
    gap: 2,
    mt: 1,
    flexWrap: { xs: "wrap", md: "nowrap" }, 
  }}
>
  {/* Water Intake */}
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 2 }}>
        {/* header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "rgba(37,99,235,0.1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <LocalDrinkRoundedIcon sx={{ fontSize: 18, color: "#2563eb" }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
              Water Intake
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
              Track your hydration
            </Typography>
          </Box>
        </Box>

        {/* content */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 32, fontWeight: 950 }}>
            {water}
            <span style={{ fontSize: 16, color: "#64748b", fontWeight: 700 }}>
              ml
            </span>
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => syncWater(0)}
              sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddRoundedIcon />}
              onClick={() => syncWater(water + 250)}
              sx={{
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "none",
                whiteSpace: "nowrap",
              }}
            >
              250ml
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>

  {/* Steps */}
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "rgba(139,92,246,0.1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <DirectionsWalkRoundedIcon sx={{ fontSize: 18, color: "#8b5cf6" }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
              Steps
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
              Manual entry
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            value={steps}
            onChange={(e) => syncSteps(Number(e.target.value || 0))}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
                "& fieldset": { border: "none" },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={() => syncSteps(steps + 1000)}
            sx={{
              fontWeight: 900,
              borderRadius: 2,
              px: 2,
              boxShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            +1K
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
  </Box>


{/* 6. RECENT ACTIVITY */}
<Card sx={{ ...cardStyle, mt: 2 }}>
  <CardContent sx={{ p: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
        Recent Activity
      </Typography>

      <Button
        href="/workouts"
        variant="text"
        sx={{ textTransform: "none", fontWeight: 900 }}
      >
        View all
      </Button>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {todaysWorkouts?.length > 0 ? (
        todaysWorkouts.slice(0, 3).map((w) => (
          <WorkoutRow
            key={w.id}
            workout={w}
            onEdit={() => handleEditWorkout(w)}
            onDelete={() => handleDeleteWorkout(w.id)}
          />
        ))
      ) : (
        <EmptyActivity onAdd={() => setWorkoutDialogOpen(true)} />
      )}
    </Box>
  </CardContent>
</Card>




      <BMISetupModal open={openBMI} onClose={() => setOpenBMI(false)} onSave={handleSaveProfileData} profile={profile} />
    </Box>
  );
}

/* ---------------- styles & small components ---------------- */

const cardStyle = {
  width: "100%",
  borderRadius: 2,
  border: "1px solid rgba(15,23,42,0.06)",
  boxShadow: "0 10px 30px rgba(12, 24, 45, 0.04)",
};

const IconBox = ({ children }) => (
  <Box 
  sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: "rgba(37,99,235,0.08)", display: "grid", placeItems: "center" }}>
    {children}
  </Box>
);

const infoBoxStyle = {
  mt: 2, p: 1.5, borderRadius: 1, bgcolor: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", gap: 1,
};

function SummaryTile({ title, value, unit, icon, color }) {
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid rgba(15,23,42,0.04)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 120 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, color, mb: 0.5 }}>
        {icon}
        <Typography sx={{ fontWeight: 900, fontSize: 11, letterSpacing: "0.05em" }}>{title}</Typography>
      </Box>
      <Typography sx={{ fontSize: 26, fontWeight: 950 }}>{value}</Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600 }}>{unit}</Typography>
    </Box>
  );
}

function MiniStat({ label, value, unit, chipLabel, chipColor, isGoal = false }) {
  return (
    <Box sx={{ textAlign: "center", p: 1.5, borderRadius: 2, bgcolor: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 90 }}>
      <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: 11, mb: 0.5, textTransform: 'uppercase' }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isGoal && (value === "Weight Loss" || value === "lose_weight") && <ShowChartRoundedIcon sx={{ color: '#ef4444', transform: 'rotate(135deg)', fontSize: 18 }} />}
        <Typography sx={{ fontSize: 22, fontWeight: 900 }}>{value} {unit && <span style={{ fontSize: 14, color: "#64748b" }}>{unit}</span>}</Typography>
      </Box>
      {chipLabel && <Chip label={chipLabel} color={chipColor} size="small" sx={{ mt: 0.5, fontWeight: 800, height: 18, fontSize: 9 }} />}
    </Box>
  );
}


function ProgressRing({ title, value, goal, unit = "", color = "#2563eb" }) {
  const pct = goal > 0 ? Math.min(100, Math.max(0, (value / goal) * 100)) : 0;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 170,
        p: 2,
        borderRadius: 2,
        bgcolor: "#f8fafc",
        border: "1px solid rgba(15,23,42,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Ring */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `conic-gradient(${color} ${pct}%, rgba(15,23,42,0.08) 0)`,
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Inner circle */}
        <Box
          sx={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            bgcolor: "white",
            border: "1px solid rgba(15,23,42,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1.1,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 950, color: "#0f172a" }}>
            {typeof value === "number" ? value.toLocaleString() : value}
            {unit && (
              <span style={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
                {unit}
              </span>
            )}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
            / {typeof goal === "number" ? goal.toLocaleString() : goal}
            {unit && <span style={{ fontSize: 11 }}>{unit}</span>}
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        sx={{
          mt: 1.5,
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "0.06em",
          color: "#64748b",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}



function EmptyActivity({ onAdd }) {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#f8fafc",
        border: "1px solid rgba(15,23,42,0.06)",
        textAlign: "center",
      }}
    >
      <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>
        No activities recorded for today.
      </Typography>

      <Button
        variant="text"
        onClick={onAdd}
        sx={{ mt: 1, fontWeight: 900, textTransform: "none" ,bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }     }}
      >
        Log your first workout
      </Button>
    </Box>
  );
}



