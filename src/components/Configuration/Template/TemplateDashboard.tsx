import { Box, Typography } from "@mui/material";

export default function TemplateDashboard() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: "#232323",
          textAlign: "center",
        }}
      >
        Develop Me Techieeee!!!!!!!!!!
      </Typography>
    </Box>
  );
}
