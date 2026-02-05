"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";


export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, "profiles", user.uid);

    // Create default profile if not exists
    const checkAndCreateProfile = async () => {
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const defaultProfile = {
          id: user.uid,
          full_name: user.displayName || "",
          avatar_url: null,

          height_cm: null,
          weightKg: null,
          current_weight_kg: null,
          age: null,
          gender: null,

          goal: null, // lose_weight | gain_weight | maintain
          fitness_goal: null,
          target_weight_kg: null,

          bmi: null,
          bmi_category: null,
          bmr: null,

          daily_calories_goal: 500,
          recommended_daily_calories: null,
          calories_calculated: false,

          daily_steps_goal: 10000,
          daily_water_goal_ml: 2000,
          weekly_workout_goal: 5,

          motivation: "",
          level_label: "Level 5 Athlete",

          created_at: new Date().toISOString(),
        };

        await setDoc(docRef, defaultProfile);
      }
    };

    checkAndCreateProfile();

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const docRef = doc(db, "profiles", user.uid);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return {
    profile,
    loading,
    updateProfile,
  };
}
