
import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => { const raw = localStorage.getItem('user'); if (raw) setUser(JSON.parse(raw)); }, []);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
}
