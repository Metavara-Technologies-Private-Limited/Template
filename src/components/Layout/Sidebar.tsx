import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ClinicLogoLMS from "../../assets/icons/Clinic-Logo-LMS.svg";
import VidaiLogo from "../../assets/icons/Vidai-logo.svg";
import DashboardCardBg from "../../assets/icons/dashboard_card_bg.svg";
import styles from "../../styles/sidebar.module.css";
import { SIDEBAR_TABS } from "../../config/sidebar.tabs";

type SidebarProps = {
  isDesktop?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  isDesktop = true,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const tab = SIDEBAR_TABS[0];
  const drawerWidth = isSmallScreen ? "min(86vw, 320px)" : 320;

  useEffect(() => {
    if (isDesktop && mobileOpen) {
      onClose?.();
    }
  }, [isDesktop, mobileOpen, onClose]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      onClose?.();
    }
  };

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop ? true : mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isDesktop ? 320 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          maxWidth: "100vw",
          bgcolor: "background.default",
          borderRight: "none",
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 3,
          pr: isDesktop ? 3 : 1.5,
          pt: 2.5,
        }}
      >
        <img src={ClinicLogoLMS} width={134} height={40} alt="Clinic Logo" />
        {!isDesktop && (
          <IconButton
            onClick={onClose}
            sx={{ width: 40, height: 40 }}
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box className={styles.cardWrapper} sx={{ pb: 2 }}>
        <Box className={styles.card} sx={{ mt: "12px" }}>
          <Typography color="primary.main" sx={{ fontWeight: 700 }}>
            {tab.label}
          </Typography>

          <List>
            {tab.menu.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <ListItemButton key={item.key} onClick={() => handleNavigate(item.path)}>
                  <Typography
                    sx={{
                      color: isActive ? "#232323" : "#9e9e9e",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>

          <img src={DashboardCardBg} className={styles.cardBg} alt="" />

          <Box className={styles.footer}>
            <img src={VidaiLogo} width="70%" alt="Vidai Logo" />
            <Typography fontSize={10} color="grey.400">
              Updated Version 2.0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
