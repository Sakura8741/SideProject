import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainHeader from './MainHeader';
import Mainpage from './Pages/Mainpage/Mainpage';
import Commodity1 from './Pages/Commodity/Commodity1';
import { Layout } from 'antd';
const { Footer } = Layout;
import './CssReset.css'
const App = () => {
    return (
        <BrowserRouter>
            <MainHeader />
            <Routes>
                <Route path="/" element={<Mainpage />} />
                <Route path="/signin" element={<div>Member Page</div>} />
                <Route path="/commodity1" element={<Commodity1 />} />
                <Route path="/commodity2" element={<div>/commodity2</div>} />
            </Routes>
            <Footer className='footerStyle'>
                copyright © 2023 Your Company
            </Footer>
        </BrowserRouter>
    );
};
export default App;