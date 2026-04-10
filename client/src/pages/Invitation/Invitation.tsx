import React from "react";
import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { Loading } from "@/components";
import { useAcceptInvite } from "@/hooks";

export const Invitation = () => {
  const { token } = useParams<{ token: string }>();
  const { isLoading, error } = useAcceptInvite(token);

  if (isLoading) return <Loading />;
  if (error) return <Typography>{error}</Typography>;

  return null;
};
