import axios from "axios"

const api = axios.create({
    baseURL: "https://search-car-backend.vercel.app/searchCar",
    headers:{
        "Content-Type": "application/json",
    }
})

export default api;