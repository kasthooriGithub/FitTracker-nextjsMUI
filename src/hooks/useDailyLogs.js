"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Next.js compatible version of useDailyLogs
 * Same logic as your old React project
 */
export function useDailyLogs() {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setTodayLog(null);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "daily_logs"),
      where("user_id", "==", user.uid),
      orderBy("log_date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setLogs(logData);
        setTodayLog(logData.find((log) => log.log_date === today) || null);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching daily logs:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, today]);

  const updateLog = async (field, value) => {
    if (!user) return;

    try {
      if (todayLog) {
        const logRef = doc(db, "daily_logs", todayLog.id);
        await updateDoc(logRef, { [field]: value });
      } else {
        // unique doc per user per day
        const logId = `${user.uid}_${today}`;

        await setDoc(doc(db, "daily_logs", logId), {
          user_id: user.uid,
          log_date: today,
          steps: field === "steps" ? value : 0,
          water_ml: field === "water_ml" ? value : 0,
          weight_kg: field === "weight_kg" ? value : null,
          [field]: value,
        });
      }
    } catch (error) {
      console.error("Error updating daily log:", error);
    }
  };

  return {
    todayLog,
    logs,
    loading,
    updateLog,
  };
}
