import { Box } from "@mui/material";

export const HorizontalGraph = ({ percentage }: { percentage: number }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        width: `${percentage}%`,
        height: "100%",
        bgcolor:
          percentage > 90
            ? "success.main"
            : percentage > 50
              ? "info.main"
              : percentage > 25
                ? "warning.main"
                : "error.main",
        transition: "width 0.5s",
      }}
    />
  );
};
