import { Layout, Button, Input, Typography, Row, Col, Dropdown, Menu } from 'antd';
import { HomeOutlined, UserOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './MainHeader.css';

const { Search } = Input;
const { Header } = Layout;
const { Text } = Typography;

function MainHeader() {
    // 手機版選單
    const mobileMenu = (
        <Menu>
            <Menu.Item key="product1">
                <Button type="text">商品一</Button>
            </Menu.Item>
            <Menu.Item key="product2">
                <Button type="text">商品二</Button>
            </Menu.Item>
            <Menu.Item key="signin">
                <Link to="/signin">會員</Link>
            </Menu.Item>
            <Menu.Item key="cart">
                <Link to="/cart">購物車</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className= "layoutStyle">
            <Header className="headerStyle">
                <Row className="headerRow" justify="space-between" align="middle">
                    {/* Logo */}
                    <Col>
                        <Link to="/" className="logoStyle">
                            <HomeOutlined />
                            <Text>首頁</Text>
                        </Link>
                    </Col>

                    {/* 桌面版按鈕 */}
                    <Col className="desktopMenu">
                        <Link to="/commodity1" className="membericonStyle">
                            <Button type="text">商品一</Button>
                        </Link>
                        <Link to="/commodity2" className="membericonStyle">
                            <Button type="text">商品二</Button>
                        </Link>
                        <Search className="searchStyle" placeholder="搜尋商品" allowClear />
                        <Link to="/signin" className="membericonStyle">
                            <UserOutlined />
                        </Link>
                        <Link to="/cart" className="carticonStyle">
                            <ShoppingCartOutlined />
                        </Link>
                    </Col>

                    {/* 手機版折疊選單 */}
                    <Col className="mobileMenu">
                        <Search className="searchStyle" placeholder="搜尋商品" allowClear />
                        <Dropdown overlay={mobileMenu} trigger={['click']}>
                            <Button icon={<MenuOutlined />} />
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        </Layout>
    );
}

export default MainHeader;
