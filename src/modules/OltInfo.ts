import { backendClient } from "../services/api";
import { toast } from "react-toastify";

export interface IOltData {
  olt_type: string;
  slot: string;
  port: string;
  ont_id: string;
  sn: string;
  state: string;
}

export interface IOltDataForCreate {
  data: IOltData[];
}

export const fetchOlt = async () => {
  try {
    const { data } = await backendClient.get("/info-olt");
    return data;
  } catch (error) {
    toast.error("Falha ao buscar dados da OLT!");
    console.error("Erro ao buscar dados da OLT:", error);
    throw error;
  }
};

export const createOlt = async (data: IOltDataForCreate) => {
  try {
    const response = await backendClient.post("/info-olt", data);
    toast.success("Dados cadastrados com sucesso!");
    return response.data;
  } catch (error) {
    toast.error("Falha ao enviar dados para a OLT!");
    console.error("Erro ao enviar dados para a OLT:", error);
    throw error;
  }
};

export const createOltTxt = async (formData: FormData) => {
  try {
    await backendClient.post("/upload-olt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Arquivos enviados com sucesso!");
  } catch (error) {
    console.error("Error uploading files", error);
    toast.error("Falha ao enviar os arquivos!");
  }
};
