import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainHeader from './MainHeader';
import Mainpage from './Pages/Mainpage/Mainpage';
import Products from './Pages/Products/Products';
import ProductsDetail from './Pages/Products/ProductsDetail';
import Signin from './Pages/Signin/Signin';
import Cart from './Pages/Cart/Cart';
import { UserProvider } from './context/UserContext';
import { Layout } from 'antd';
const { Footer } = Layout;
import './CssReset.css'
const App = () => {
    return (
        <UserProvider>
            <BrowserRouter>
                <MainHeader />
                <Routes >
                    <Route path="/" element={<Mainpage />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path=":categoryId" element={<Products />} />
                    <Route path=":categoryId/:productId" element={<ProductsDetail />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
                <Footer className='footerStyle'>
                    copyright © 2025 SideProject
                </Footer>
            </BrowserRouter>
        </UserProvider>
    );
};
export default App;