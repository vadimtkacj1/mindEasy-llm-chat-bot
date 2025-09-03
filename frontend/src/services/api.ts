import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const sendMessage = async (data: {
    message: string;
    model_name?: string;
}) => {
    const response = await axios.post(`${API_BASE_URL}/chat`, data);
    return response.data;
};

export const getModels = async () => {
    const response = await axios.get(`${API_BASE_URL}/models`);
    return response.data;
};

export const updateModel = async (model_name: string) => {
    const response = await axios.post(`${API_BASE_URL}/models`, {
        model_name,
    });
    return response.data;
};
