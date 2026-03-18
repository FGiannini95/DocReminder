import { axiosInstance } from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";

export const fetchAllDocuments = async () => {
  const res = await axiosInstance.get(`${DOC_URL}`);
  return res.data;
};

export const fetchOneDocument = async (id: string) => {
  const res = await axiosInstance.get(`${DOC_URL}/${id}`);
  return res.data;
};
