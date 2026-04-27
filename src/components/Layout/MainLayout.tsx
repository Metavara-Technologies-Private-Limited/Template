import { lazy, Suspense, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import styles from "../../styles/sidebar.module.css";

const Header = lazy(() => import("./Header"));
const Sidebar = lazy(() => import("./Sidebar"));

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Suspense fallback={<Box sx={{ width: isDesktop ? 320 : 0, flexShrink: 0 }} />}>
        <Sidebar
          isDesktop={isDesktop}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </Suspense>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Suspense fallback={<Box sx={{ height: 88 }} />}>
          <Header
            showSidebarToggle={!isDesktop}
            onSidebarToggle={() => setMobileSidebarOpen((open) => !open)}
          />
        </Suspense>

        <Box className={styles.cardWrapper} sx={{ m: 0, pb: 2, minWidth: 0 }}>
          <Box className={styles.card} sx={{ flexGrow: 1, minWidth: 0, overflow: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
