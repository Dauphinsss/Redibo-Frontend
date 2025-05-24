import axios from "axios";

const apiAllCards = axios.create({
    baseURL: "https://search-car-backend.vercel.app/searchCar",
    headers: {
        "Content-Type": "application/json",
    },
});

const apiCarById = axios.create({
    baseURL: "https://search-car-backend.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

const apiFormularioCondicionesUsoAuto = axios.create({
    baseURL: "https://search-car-backend.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

const apiCobertura = axios.create({
    baseURL: "https://search-car-backend.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

const getCondicionesUsoAutoAPI = (id_carro: number) => {
    return apiCarById.get(`/useConditon/${id_carro}`);
};

export {
    apiAllCards,
    apiCarById,
    apiFormularioCondicionesUsoAuto,
    apiCobertura,
    getCondicionesUsoAutoAPI,
};