import React from "react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

interface SecurityCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onActivate: () => void;
}

export const SecurityCard = ({
  title,
  description,
  buttonLabel,
  onActivate,
}: SecurityCardProps) => {
  return (
    <Card sx={{ width: "100%", border: "2px solid", borderRadius: "10px" }}>
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
          sx={{ backgroundColor: "grey.900", color: "white", width: "100%" }}
          onClick={onActivate}
        >
          {buttonLabel}
        </Button>
      </CardActions>
    </Card>
  );
};
