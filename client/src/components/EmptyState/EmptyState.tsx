import React from "react";

import { Card, CardContent, Typography } from "@mui/material";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({
  message = "Aún no has añadido ningún documento.",
}: EmptyStateProps) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        p: 1,
        border: "1px solid",
        boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Typography variant="body2">{message}</Typography>
      </CardContent>
    </Card>
  );
};
