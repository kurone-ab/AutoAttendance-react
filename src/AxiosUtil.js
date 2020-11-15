import Axios from "axios";
import {Agent} from 'https'

export const AxiosInstance = Axios.create({
    withCredentials: true,
    baseURL: "https://3.35.0.42:8080/"
})