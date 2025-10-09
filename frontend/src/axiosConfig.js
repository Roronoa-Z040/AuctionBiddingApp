import axios from 'axios';

// For production via Nginx proxy
const baseURL = process.env.REACT_APP_API_URL || '/api';

const instance = axios.create({ baseURL });
export default instance;
