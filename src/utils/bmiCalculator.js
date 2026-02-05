// BMI = weight (kg) / height (m)^2
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  if (!heightM || heightM <= 0) return 0;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi) {
  if (!bmi || bmi <= 0) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Mifflin-St Jeor Equation
export function calculateBMR(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age) return 0;

  if (gender === "female") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // male default
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

export function calculateDailyCalories(bmr, goal) {
  if (!bmr) return 0;

  // sedentary activity multiplier
  let calories = bmr * 1.2;

  if (goal === "lose_weight") calories -= 500;
  if (goal === "gain_weight") calories += 300;

  return Math.round(calories);
}
