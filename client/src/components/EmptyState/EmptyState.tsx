import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

export const EmptyState = () => {
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
        <Typography variant="body2">Aún no has creado ningún documento.</Typography>
      </CardContent>
    </Card>
  );
};
