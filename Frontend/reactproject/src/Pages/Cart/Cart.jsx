
import { useState, useEffect } from 'react';
import { Avatar,Statistic,Card, Typography, Breadcrumb, Row, Col, InputNumber, Button ,List } from 'antd'

const initialCart = [
    {
        id: 1,
        name: "藍牙耳機",
        price: 1200,
        qty: 2,
        image: "https://picsum.photos/80/80",
    },
    {
        id: 2,
        name: "無線滑鼠",
        price: 800,
        qty: 1,
        image: "https://picsum.photos/80/80",
    },
    {
        id: 3,
        name: "機械鍵盤",
        price: 2500,
        qty: 1,
        image: "https://picsum.photos/80/80",
    },
];
function Cart() {
    const [cartItems, setCartItems] = useState(initialCart);

    // 更新數量
    const updateQty = (id, qty) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, qty } : item
            )
        );
    };

    // 刪除商品
    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    // 計算總金額
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <Row gutter={16} style={{ marginTop: '64px', height: '100vh', width: '100%' ,padding: '32px'} }>
            {/* 左邊：商品清單 */}
            <Col xs={24} md={16}>
                <Card title="購物車清單">
                    <List
                        itemLayout="horizontal"
                        dataSource={cartItems}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <InputNumber
                                        min={1}
                                        value={item.qty}
                                        onChange={value => updateQty(item.id, value)}
                                    />,
                                    <Button danger onClick={() => removeItem(item.id)}>
                                        刪除
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.image} shape="square" size={64} />}
                                    title={item.name}
                                    description={`單價：$${item.price}`}
                                />
                                <div>小計：${item.price * item.qty}</div>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>

            {/* 右邊：總金額區塊 */}
            <Col xs={24} md={8}>
                <Card>
                    <Statistic title="總金額" value={totalPrice} prefix="$" />
                    <Button type="primary" block style={{ marginTop: 16 }}>
                        前往結帳
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default Cart;