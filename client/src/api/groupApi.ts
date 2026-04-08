import { axiosInstance } from "./axiosInstance";
import { GROUP_URL } from "./apiConfig";

export const fetchAllGroups = async () => {
  const res = await axiosInstance.get(`${GROUP_URL}`);
  return res.data;
};

export const fetchOneGroup = async (id: string) => {
  const res = await axiosInstance.get(`${GROUP_URL}/${id}`);
  return res.data;
};
