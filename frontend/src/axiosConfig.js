
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';
const instance = axios.create({ baseURL });
export default instance;
