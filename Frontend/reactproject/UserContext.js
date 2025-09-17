import React, { createContext, useContext, useState } from 'react';

// 建立 UserContext
const UserContext = createContext(null);

// 提供者元件
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    })

    // 登入
    const login = (userData) => {
        setUser(userData);
    };

    // 登出
    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// 自訂 hook 方便使用
export const useUser = () => useContext(UserContext);