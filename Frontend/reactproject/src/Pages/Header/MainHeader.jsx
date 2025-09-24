import { Layout, Button, Input, Typography, Row, Col, Dropdown, Menu, AutoComplete, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useRequireLogin } from "../../hooks/useRequireLogin";
import './MainHeader.css';
import debounce from "lodash.debounce";

const { Search } = Input;
const { Header } = Layout;
const { Text } = Typography;
function MainHeader() {
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [messageApi, contextHolder] = message.useMessage();
    const { checkLogin, LoginModal } = useRequireLogin();

    const handleCartClick = () => {
        checkLogin(() => {
            navigate("/cart");
        });
    }
    // 手機版選單
    const mobileMenu = (
        <Menu>
            <Menu.Item key="accessories">
                <Link to="/accessories">飾品</Link>
            </Menu.Item>
            <Menu.Item key="perfume">
                <Link to="/perfume">香水</Link>
            </Menu.Item>
            <Menu.Item key="cart">
                <div onClick={handleCartClick}>
                    購物車
                </div>
            </Menu.Item>
        </Menu>
    );

    const handleLogout = () => {
        logout();
        messageApi.open({
            type: 'success',
            content: '已成功登出',
            duration: 1.5,
            onClose: () => navigate("/"),
        });
    }

    const userMenu = (
        <Menu>
            {user?.role === "Admin" && ( 
                <Menu.Item key="Admin" >
                    <a onClick={() => { navigate("/productManagement") }}>
                        商品管理
                    </a>
                </Menu.Item>
            )}
            <Menu.Item key="logout" >
                <a onClick={() => { handleLogout(); }}>
                    登出會員
                </a>
            </Menu.Item>
        </Menu>
    );

    const handleSearch = debounce(async (value) => {
        if (!value) {
            setOptions([]);
            return;
        }

        try {
            const res = await fetch(`https://localhost:7207/api/Products/search?keyword=${value}`);
            const data = await res.json();
            setOptions(data.map(item => ({
                value: item.value,
                productId: item.id,
                category: item.category,
            })));

        }
        catch (error) {
            console.error("搜尋失敗", error);
        }
    }, 500);

    const handleSelect = (value, option) => {
        navigate(`${option.category}/${option.productId}`);
        setOptions([]);
    }

    

    return (
        <Layout >
            {LoginModal}
            {contextHolder}
            <Header className="headerStyle">
                <Row className="headerRow" justify="space-between" align="middle">
                    {/* Logo */}
                    <Col>
                        <Link to="/" className="logoStyle">
                            <Button type="text" className="productButton">首頁</Button>
                        </Link>
                    </Col>

                    {/* 桌面版按鈕 */}
                    <Col className="desktopMenu">
                        <Link to="/accessories" >
                            <Button type="text" className="productButton">飾品</Button>
                        </Link>
                        <Link to="/perfume" >
                            <Button type="text" className="productButton">香水</Button>
                        </Link>
                        <AutoComplete
                            options={options}
                            onSearch={handleSearch}
                            onSelect={handleSelect}
                            defaultActiveFirstOption={false}
                            className='searchStyle'
                        >
                            <Input.Search placeholder="搜尋商品" onSearch={(value) => {
                                handleSearch(value)
                                handleSelect(value, options[0])
                                setOptions([])
                            }} />
                        </AutoComplete>
                        {!user ? (
                            < Link to="/login"  >
                                <Button className="w-full flex gap-2 p-0 text-[#4CAF93]" type="text">
                                    <UserOutlined />
                                    會員登入
                                </Button>
                            </Link>

                        ) : (
                            <Dropdown overlay={userMenu}>
                                    <Text className="flex gap-2 whitespace-nowrap cursor-default">
                                    <UserOutlined />
                                    {user.username}
                                </Text>
                            </Dropdown>
                        )}

                        <div onClick={handleCartClick} className="carticonStyle">
                            <ShoppingCartOutlined />
                        </div>
                    </Col>

                    {/* 手機版折疊選單 */}
                    <Col className="mobileMenu">
                        <AutoComplete
                            options={options}
                            onSearch={handleSearch}
                            onSelect={handleSelect}
                            defaultActiveFirstOption={false}
                            className='searchStyle'
                        >
                            <Input.Search placeholder="搜尋商品" onSearch={(value) => {
                                handleSearch(value)
                                handleSelect(value, options[0])
                                setOptions([])
                            }} />
                        </AutoComplete>
                        {!user ? (
                            < Link to="/login"  >
                                <Button className="w-full flex gap-2 p-0 text-[#4CAF93]" type="text">
                                    <UserOutlined />
                                    會員登入
                                </Button>
                            </Link>

                        ) : (
                            <Dropdown overlay={userMenu}>
                                    <Text className="flex gap-2 whitespace-nowrap cursor-default">
                                    <UserOutlined />
                                    {user.username}
                                </Text>
                            </Dropdown>
                        )}
                        <Dropdown overlay={mobileMenu} trigger={['click']}>
                            <Button className="w-full" icon={<MenuOutlined />} />
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        </Layout>
    );
}

export default MainHeader;
