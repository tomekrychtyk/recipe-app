import { Box, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { styled } from "@mui/material/styles";

const ThumbnailPlaceholder = styled(Box)(({ theme }) => ({
  width: "50px",
  height: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.grey[400]}`,
}));

interface MealThumbnailProps {
  thumbnailUrl?: string | null;
  alt: string;
}

export function MealThumbnail({ thumbnailUrl, alt }: MealThumbnailProps) {
  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={alt}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    );
  }

  return (
    <ThumbnailPlaceholder>
      <RestaurantIcon sx={{ fontSize: 24, color: "grey.500" }} />
    </ThumbnailPlaceholder>
  );
}
