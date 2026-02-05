"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Button,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export const SIDEBAR_WIDTH = 264;

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <DashboardRoundedIcon /> },
  { href: "/nutrition", label: "Nutrition", icon: <RestaurantRoundedIcon /> },
  { href: "/workouts", label: "Workouts", icon: <FitnessCenterRoundedIcon /> },
  
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const [showSignout, setShowSignout] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const initials = useMemo(() => {
    const name = profile?.full_name?.trim();
    if (name) return name.charAt(0).toUpperCase();
    const email = user?.email?.trim();
    return email ? email.charAt(0).toUpperCase() : "U";
  }, [profile?.full_name, user?.email]);

  const handleSignout = async () => {
    setShowSignout(false);
    await signOut();
    router.push("/login");
  };

  const SidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 3, py: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: "primary.main",
              display: "grid",
              placeItems: "center",
              color: "primary.contrastText",
            }}
          >
            <BoltRoundedIcon />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 900, m: 0 }}>
            FitTrack Pro
          </Typography>
        </Stack>
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 3,
                mb: 0.75,
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "primary.contrastText" : "text.secondary",
                "&:hover": { bgcolor: isActive ? "primary.dark" : "action.hover" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? "primary.contrastText" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 700, fontSize: 13 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* user card */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar sx={{ bgcolor: "grey.900", color: "white", fontWeight: 900 }}>
            {initials}
          </Avatar>

          <Box sx={{ overflow: "hidden" }}>
            <Typography sx={{ fontWeight: 900, fontSize: 13 }} noWrap>
              {profile?.full_name || "User"}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12 }} noWrap>
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
        </Paper>

        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutRoundedIcon />}
          onClick={() => setShowSignout(true)}
          sx={{
            mt: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            justifyContent: "flex-start",
            color: "text.secondary",
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop sidebar only */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
            },
          }}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Mobile bottom navigation */}
      {!isDesktop && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-around", py: 1 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    minWidth: 64,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 3,
                    color: isActive ? "primary.main" : "text.secondary",
                    flexDirection: "column",
                    gap: 0.5,
                    fontWeight: 800,
                    fontSize: 11,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: isActive ? "rgba(25,118,210,0.12)" : "transparent",
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                      transition: "0.2s",
                    }}
                  >
                    {item.icon}
                  </Box>
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Paper>
      )}

      <ConfirmDialog
        open={showSignout}
        title="Sign out?"
        message="Are you sure you want to sign out from FitTrack?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onCancel={() => setShowSignout(false)}
        onConfirm={handleSignout}
      />
    </>
  );
}
