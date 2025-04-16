import axios from "axios"

const api2 = axios.create({
    baseURL: "https://search-car-backend.vercel.app/",
    headers:{
        "Content-Type": "application/json",
    }
})

export default api2;