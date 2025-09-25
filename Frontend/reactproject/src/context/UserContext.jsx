import { useEffect, createContext, useContext, useState } from 'react';

/* 建立 UserContext */
export const UserContext = createContext(null);

/* 提供 UserContext 的 Provider */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* 初始化時從 localStorage 讀取使用者資料 */
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    },[])
    
    if (loading) return null;

    /* 登入 */
    const login = (userName , userId , role , token) => {
        setUser({
            username: userName,
            userId: userId,
            role: role,
        });
        localStorage.setItem("user", JSON.stringify({
            username: userName,
            userId: userId,
            token: token,
        }));
    };
    
    /* 登出 */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

/* 自訂 Hook 方便使用 UserContext */
export const useUser = () => useContext(UserContext);