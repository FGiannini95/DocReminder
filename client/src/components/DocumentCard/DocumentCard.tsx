import React from "react";

import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { EmptyState } from "../EmptyState/EmptyState";
import axiosInstance from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface Document {
  documentId: number;
  type: DocumentType;
  name: string | null;
  documentNumber: string | null;
  expiryDate: string;
  reminderDays: number[];
  personalNote: string | null;
}
type DocumentType = "passport" | "id" | "driver_license" | "health" | "credit_card" | "custom";

const typeLabels: Record<DocumentType, string> = {
  passport: "Pasaporte",
  id: "DNI",
  driver_license: "Carnet de conducir",
  health: "Tarjeta sanitaria",
  credit_card: "Tarjeta bancaria",
  custom: "Otro",
};

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const statusConfig = {
  urgent: {
    borderColor: "error.light",
    textColor: "error.dark",
    barColor: "error.main",
    shadow: "0px 0px 8px rgba(239, 83, 80, 0.4)",
  },
  upcoming: {
    borderColor: "warning.light",
    textColor: "warning.main",
    barColor: "warning.light",
    shadow: "0px 0px 8px rgba(255, 152, 0, 0.4)",
  },
  ok: {
    borderColor: "success.light",
    textColor: "success.dark",
    barColor: "success.main",
    shadow: "0px 0px 8px rgba(102, 187, 106, 0.4)",
  },
};

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
