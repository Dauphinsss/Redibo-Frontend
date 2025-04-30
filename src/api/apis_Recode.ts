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

export { apiAllCards, apiCarById };