import axios from "axios";

export const API_URL = import.meta.env.VITE_REACT_API_URL;

const backendClient = axios.create({
  baseURL: API_URL,
});

export const getFirmwareList = async () => {
  try {
    const response = await backendClient.get("/api/firmwares");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lista de firmwares:", error);
    throw error;
  }
};

export const createFirmware = async (firmwareData: any) => {
  try {
    const response = await backendClient.post("/firmwares", firmwareData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar firmware:", error);
    throw error;
  }
};
