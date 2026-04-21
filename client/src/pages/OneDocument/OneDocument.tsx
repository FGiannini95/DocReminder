import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Alert, Box, Button, Chip, Typography } from "@mui/material";

import { DocumentHeader, ErrorMessage, Loading, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";
import { axiosInstance } from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { scrollableContentSx, containedButtonSx } from "@/styles/commonStyle";
import { Document, typeLabels } from "@/types/document";
import { fetchOneDocument } from "@/api/documentApi";
import { useAuth } from "@/context";

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const isLong = value.length > 15;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isLong ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isLong ? "flex-start" : "center",
        gap: isLong ? 0.5 : 0,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight="bold">{value}</Typography>
    </Box>
  );
};

export const OneDocument = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isFromGroup = searchParams.get("groupId");
  const ownerName = searchParams.get("ownerName");

  const queryClient = useQueryClient();
  const daysUntil = (dateStr: string) =>
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const {
    data: doc,
    isPending,
    isError,
  } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: () => fetchOneDocument(id!),
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el documento" />;

  const days = daysUntil(doc.expiryDate);
  const isExpired = days <= 0;
  const canEdit = doc.user_id === user || doc.dependent_id !== null;
  const isMyDocument = doc.user_id === user;

  const handleEdit = () => {
    vibrate();
    const groupParam = isFromGroup ? `?groupId=${isFromGroup}` : "";
    navigate(`/edit-document/${doc.documentId}${groupParam}`, { replace: true });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`${DOC_URL}/delete-document/${id}`)
      .then(() => {
        vibrate();
        if (isFromGroup) {
          queryClient.invalidateQueries({ queryKey: ["group", isFromGroup] });
          navigate(`/group/${isFromGroup}`);
        } else {
          navigate(DocReminderRoutes.home);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <DocumentHeader title="Detalle documento" onBack={() => navigate(-1)} />

        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, p: 3 }}>
          {!isMyDocument && ownerName && (
            <Typography>
              Pertenece a: <Chip label={ownerName} size="small" sx={{ borderRadius: 2 }} />
            </Typography>
          )}

          {isExpired && <Alert severity="error">Caducado hace {Math.abs(days)} días</Alert>}
          {!isExpired && days <= 30 && (
            <Alert severity="error">Date prisa. Caduca en {days} días</Alert>
          )}
          {!isExpired && days <= 60 && days > 30 && (
            <Alert severity="warning">Caduca pronto, en {days} días</Alert>
          )}

          {doc.name && <InfoRow label="Nombre" value={doc.name ?? ""} />}
          <InfoRow label="Tipo de documento" value={typeLabels[doc.type]} />
          {doc.documentNumber && <InfoRow label="Número" value={doc.documentNumber ?? ""} />}
          <InfoRow label="Fecha de caducidad" value={dayjs(doc.expiryDate).format("DD/MM/YYYY")} />
          <InfoRow label="Recordatorio" value={doc.reminderDays.map((d) => `${d}d`).join(", ")} />
          {doc.personalNote && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Notas
              </Typography>
              <Box sx={{ border: "1px solid", borderRadius: 2, p: 2, borderColor: "divider" }}>
                <Typography variant="body2">{doc.personalNote ?? ""}</Typography>
              </Box>
            </Box>
          )}

          {/* Spacer — pushes buttons to bottom */}
          <Box sx={{ flex: 1 }} />

          {/* Actions buttons */}
          {canEdit && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleEdit}
                sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
              >
                Editar
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleDelete}
                sx={{
                  ...containedButtonSx,
                  backgroundColor: "rgba(239, 83, 80, 0.4)",
                  color: "error.dark",
                  border: "1px solid",
                }}
              >
                Eliminar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </PageTransition>
  );
};
