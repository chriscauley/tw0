import axios from 'axios'

const api = axios.create({ baseURL: '/' })
api.interceptors.response.use((r) => r.data) //, handleError);

export default api
