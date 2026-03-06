import React from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { EmptyState } from "../EmptyState/EmptyState";

export const DocumentCard = () => {
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* TODO: replace "federico" with emailPrefix prop */}
        <Typography variant="h6" fontWeight="bold">
          Mis documentos:
        </Typography>
        <Typography>
          If there is content, map throught i and display in this section. Else, show EmptyState
        </Typography>
        <EmptyState />

        <Card
          sx={{ borderRadius: 2, boxShadow: "0px 0px 12px rgba(0,0,0,0.08)", border: "1px solid" }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}
          >
            {/* Lateral coloured bar */}
            <Box
              sx={{
                width: 6,
                height: 56,
                borderRadius: 4,
                backgroundColor: "error.main",
                flexShrink: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">Mi pasaporte</Typography>
              <Typography variant="caption" color="text.secondary">
                Pasaporte · 15/03/2025
              </Typography>
            </Box>

            {/* Countdown */}
            <Box
              sx={{
                border: "2px solid",
                borderColor: "error.light",
                borderRadius: 2,
                boxShadow: "0px 0px 8px rgba(239, 83, 80, 0.4)",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ color: "error.dark" }}>
                24d
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{ borderRadius: 2, boxShadow: "0px 0px 12px rgba(0,0,0,0.08)", border: "1px solid" }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}
          >
            {/* Lateral coloured bar */}
            <Box
              sx={{
                width: 6,
                height: 56,
                borderRadius: 4,
                backgroundColor: "warning.main",
                flexShrink: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">DNI</Typography>
              <Typography variant="caption" color="text.secondary">
                Documento de Identidad · 20/08/2027
              </Typography>
            </Box>

            {/* Countdown */}
            <Box
              sx={{
                border: "2px solid",
                borderColor: "warning.light",
                borderRadius: 2,
                boxShadow: "0px 0px 8px rgba(255, 152, 0, 0.4)",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ color: "warning.main" }}>
                63d
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{ borderRadius: 2, boxShadow: "0px 0px 12px rgba(0,0,0,0.08)", border: "1px solid" }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}
          >
            {/* Lateral coloured bar */}
            <Box
              sx={{
                width: 6,
                height: 56,
                borderRadius: 4,
                backgroundColor: "success.main",
                flexShrink: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">Carné de conducir</Typography>
              <Typography variant="caption" color="text.secondary">
                Permiso de condución · 10/04/2026
              </Typography>
            </Box>

            {/* Countdown */}
            <Box
              sx={{
                border: "2px solid",
                borderColor: "success.light",
                borderRadius: 2,
                boxShadow: "0px 0px 8px rgba(102, 187, 106, 0.4)",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption" fontWeight="bold" sx={{ color: "succcess.dark" }}>
                435d
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
