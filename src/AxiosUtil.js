import Axios from "axios";
import {Agent} from 'https'

export const AxiosInstance = Axios.create({
    httpsAgent: new Agent({
       rejectUnauthorized: false
    }),
    withCredentials: true,
    baseURL: "https://localhost:8080/"
})