import { useEffect,createContext, useContext, useState } from 'react';
// 建立 UserContext
export const UserContext = createContext(null);

// 提供者元件
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    },[])

    // 登入
    const login = (userName , userId) => {
        setUser({
            username: userName,
            userId: userId,
        });
        localStorage.setItem("user", JSON.stringify({
            username: userName,
            userId: userId,
        }));
    };
    
    // 登出
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

// 自訂 hook 方便使用
export const useUser = () => useContext(UserContext);