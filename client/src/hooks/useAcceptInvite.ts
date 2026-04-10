import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";

export const useAcceptInvite = (token: string | undefined) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token:", token);

    if (!token) return;

    setIsLoading(true);
    axiosInstance
      .get(`${GROUP_URL}/accept-invite/${token}`)
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        navigate(`/group/${res.data.groupId}`);
      })
      .catch(() => {
        setIsLoading(false);
        setError("El enlace ha caducado o no es válido");
      });
  }, [token, navigate]);

  return { isLoading, error };
};
