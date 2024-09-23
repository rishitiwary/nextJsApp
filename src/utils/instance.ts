import axios from 'axios'
const token = localStorage.getItem('accessToken');
const url = axios.create({
    baseURL: process.env.NEXT_APP_API_URL,    
})

const media_Url = axios.create({
    baseURL: process.env.NEXT_APP_MEDIA_URL,
})

url.defaults.headers.common['Authorization']='Bearer' +token;

export { url, media_Url }
