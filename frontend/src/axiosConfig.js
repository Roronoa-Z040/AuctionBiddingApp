
import axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL || 'http://13.211.211.43:5001';
const instance = axios.create({ baseURL });
export default instance;
