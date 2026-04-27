import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CalendarIcon from "../../assets/icons/calendar.svg";
import ProfileIcon from "../../assets/icons/Ellipse_Profile.svg";

type HeaderProps = {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
};

export default function Header({
  showSidebarToggle = false,
  onSidebarToggle,
}: HeaderProps) {
  const mockClinic = "Crysta IVF, Banglore";
  const mockUser = {
    name: "Kate Russell",
    role: "Receptionist",
  };

  const quickActions = [
    { key: "calendar", icon: CalendarIcon, label: "Calendar" },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "88px",
          px: { xs: 1.5, sm: 3 },
          gap: { xs: 1, md: 1.5 },
        }}
      >
        {showSidebarToggle && (
          <IconButton
            onClick={onSidebarToggle}
            aria-label="Open sidebar"
            sx={{ mr: 1.5 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography sx={{ fontWeight: 500, color: "text.secondary" }}>
          Configuration
        </Typography>

        <Box sx={{ mx: 1, color: "text.secondary" }}>{">"}</Box>

        <Typography sx={{ fontWeight: 700 }}>Template Designer</Typography>

        <Box
          sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: { xs: 1.25, md: 2.25 },
              py: 1.1,
              borderRadius: "16px",
              bgcolor: "#F4F4F4",
            }}
          >
            <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
              Clinic:
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{mockClinic}</Typography>
            <ArrowDropDownIcon sx={{ color: "#4B5563" }} />
          </Box>

          <Stack direction="row" spacing={1}>
            {quickActions.map((action) => (
              <IconButton
                key={action.key}
                aria-label={action.label}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  bgcolor: "#ffffff",
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #F0F0F0",
                }}
              >
                <Box
                  component="img"
                  src={action.icon}
                  alt={action.label}
                  sx={{ width: 24, height: 24 }}
                />
              </IconButton>
            ))}
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={ProfileIcon}
              alt="Profile"
              sx={{ width: 38, height: 38, borderRadius: "50%" }}
            />

            <Box
              sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.15 }}
            >
              <Typography sx={{ fontWeight: 700 }}>{mockUser.name}</Typography>
              <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>
                {mockUser.role}
              </Typography>
            </Box>

            <ArrowDropDownIcon sx={{ color: "#6B7280" }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
