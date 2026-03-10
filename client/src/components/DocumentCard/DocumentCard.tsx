import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";

import { EmptyState } from "../EmptyState/EmptyState";
import { axiosInstance } from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { Document, typeLabels } from "@/types/document";
import { statusConfig } from "@/styles/commonStyle";

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

export const DocumentCard = () => {
  const navigate = useNavigate();
  const fetchAllDocumnets = async () => {
    const res = await axiosInstance.get(`${DOC_URL}`);
    return res.data;
  };

  const {
    data: documents,
    isPending,
    isError,
  } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: fetchAllDocumnets,
  });

  if (isPending) return <CircularProgress />;
  if (isError) return <Typography>Error al cargar el documento</Typography>;

  const sorted = [...(documents ?? [])].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Mis documentos:
        </Typography>
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          sorted.map((doc) => {
            const days = daysUntil(doc.expiryDate);
            const status = days <= 30 ? "urgent" : days <= 60 ? "upcoming" : "ok";
            const config = statusConfig[status];

            return (
              <Card
                key={doc.documentId}
                onClick={() => navigate(`/document/${doc.documentId}`)}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0px 0px 12px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  cursor: "pointer",
                }}
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
                      backgroundColor: config.barColor,
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold"> {doc.name || typeLabels[doc.type]}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.name ? `${typeLabels[doc.type]} · ` : ""}
                      {dayjs(doc.expiryDate).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>

                  {/* Countdown */}
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: config.borderColor,
                      borderRadius: 2,
                      boxShadow: config.shadow,
                      px: 1.5,
                      py: 0.5,
                      minWidth: 52,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ color: config.textColor }}
                    >
                      {days > 0 ? `${days}d` : "Vencido"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );
};
