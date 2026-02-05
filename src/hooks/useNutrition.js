"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Next.js compatible version of useNutrition
 * Same logic as old React project
 */
export function useNutrition(
  selectedDate = new Date().toISOString().split("T")[0]
) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "nutrition_entries"),
      where("user_id", "==", user.uid),
      where("entry_date", "==", selectedDate)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entryData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // client-side sort (same as old app)
        entryData.sort((a, b) => {
          const tA = a.created_at?.toMillis?.() || 0;
          const tB = b.created_at?.toMillis?.() || 0;
          return tA - tB;
        });

        setEntries(entryData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching nutrition entries:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedDate]);

  const addEntry = async (entry) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "nutrition_entries"), {
        ...entry,
        user_id: user.uid,
        entry_date: selectedDate,
        created_at: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding nutrition entry:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "nutrition_entries", id));
    } catch (error) {
      console.error("Error deleting nutrition entry:", error);
    }
  };

  // 🔹 Grouping & totals (used by dashboard)
  const meals = {
    Breakfast: entries.filter((e) => e.meal_type === "Breakfast"),
    Lunch: entries.filter((e) => e.meal_type === "Lunch"),
    Dinner: entries.filter((e) => e.meal_type === "Dinner"),
    Snacks: entries.filter((e) => e.meal_type === "Snacks"),
  };

  const totals = entries.reduce(
    (acc, curr) => ({
      calories: acc.calories + (Number(curr.calories) || 0),
      protein: acc.protein + (Number(curr.protein) || 0),
      carbs: acc.carbs + (Number(curr.carbs) || 0),
      fat: acc.fat + (Number(curr.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    entries,
    meals,
    totals,
    loading,
    addEntry,
    deleteEntry,
  };
}
