import React from "react";
import { Button, Card, CardActions, CardContent, Switch, Typography } from "@mui/material";

interface SecurityCardProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  onActivate: () => void;
  compact?: boolean;
  onClick: () => void;
  checked: boolean;
}

export const SecurityCard = ({
  title,
  description,
  buttonLabel,
  onActivate,
  compact,
  onClick,
  checked = false,
}: SecurityCardProps) => {
  if (compact) {
    return (
      <Card sx={{ width: "100%", border: "1px solid", borderRadius: 2 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: "16px !important",
          }}
          onClick={onClick}
        >
          <Typography fontWeight="bold">{title}</Typography>

          <Switch
            checked={checked}
            onChange={onActivate}
            onClick={(e) => e.stopPropagation()}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "text.primary",
              },
              "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                backgroundColor: "text.primary",
              },
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: "100%", border: "2px solid", borderRadius: 8 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={{
            backgroundColor: "grey.900",
            color: "white",
            width: "100%",
            borderRadius: 8,
            py: 1.5,
          }}
          onClick={onActivate}
        >
          {buttonLabel}
        </Button>
      </CardActions>
    </Card>
  );
};
