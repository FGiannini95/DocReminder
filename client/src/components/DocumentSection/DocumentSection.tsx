import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

import { statusConfig } from "@/styles/commonStyle";
import { Document, typeLabels } from "@/types/document";
import { EmptyState } from "../EmptyState/EmptyState";
import { Loading } from "../Loading/Loading";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { GroupDocument } from "@/types/group";

interface DocumentSectionProps {
  documents: Document[] | GroupDocument[];
  isError: boolean;
  isPending: boolean;
  title?: string;
}

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

export const DocumentSection = ({ documents, isError, isPending }: DocumentSectionProps) => {
  const navigate = useNavigate();
  //Todo hay que cambiarle el nombre

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el documento" />;

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography fontWeight="bold">Mis documentos:</Typography>
        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          documents.map((doc) => {
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
                      alignSelf: "stretch",
                      borderRadius: 4,
                      backgroundColor: config.barColor,
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    {"ownerName" in doc && doc.ownerName && (
                      <Chip label={doc.ownerName} size="small" sx={{ mt: 0.5, borderRadius: 2 }} />
                    )}
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
