"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { SIDEBAR_WIDTH } from "@/components/Sidebar";

const SIDEBAR_W = SIDEBAR_WIDTH;// sidebar width 

export default function DashboardLayout({ children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading) return null;
  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar-fiixed */}
      <Sidebar />

      {/* Content area shifted to the right on desktop */}
      <Box
        component="main"
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },

          ml: { xs: 0, md: `${SIDEBAR_W}px` },
          width: { xs: "100%", md: `calc(100% - ${SIDEBAR_W}px)` },


          maxWidth: "none",
          minWidth: 0,
        }}
      >
        {children}
      </Box>

    </Box>
  );
}
