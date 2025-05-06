import axios from "axios";

const apiAllCards = axios.create({
    baseURL: "http://localhost:4000/searchCar",
    headers: {
        "Content-Type": "application/json",
    },
});

const apiCarById = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
});

export { apiAllCards, apiCarById };