"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Next.js compatible version of useWorkouts
 * Adapted from your old React project
 */
export function useWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "workouts"),
      where("user_id", "==", user.uid),
      orderBy("workout_date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const workoutData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setWorkouts(workoutData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching workouts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addWorkout = async (workout) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "workouts"), {
        ...workout,
        user_id: user.uid,
      });
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

  const updateWorkout = async (workout) => {
    try {
      const workoutRef = doc(db, "workouts", workout.id);
      const { id, ...data } = workout;
      await updateDoc(workoutRef, data);
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  // 🔹 Today's summary (same logic as old app)
  const today = new Date().toISOString().split("T")[0];

  const todaysWorkouts = workouts.filter(
    (w) => w.workout_date === today
  );

  const todaysTotalCalories = todaysWorkouts.reduce(
    (sum, w) => sum + (w.calories_burned || 0),
    0
  );

  const todaysTotalMinutes = todaysWorkouts.reduce(
    (sum, w) => sum + (w.duration_minutes || 0),
    0
  );

  return {
    workouts,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    todaysWorkouts,
    todaysTotalCalories,
    todaysTotalMinutes,
  };
}
