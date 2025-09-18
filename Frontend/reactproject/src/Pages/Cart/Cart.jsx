import { useState, useEffect } from 'react';
import { Avatar, Statistic, Card, Typography, Breadcrumb, Row, Col, InputNumber, Button, List } from 'antd'
import { useUser } from '../../context/UserContext';
function Cart() {
    const { user } = useUser();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!user) return;
        fetch(`https://localhost:7207/api/Cart/${user.userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setCartItems(data);
            })
            .catch(err => console.error("Fetch error:", err));
    }
        , [user]);

    // 更新數量
    const updateQty = (id, qty) => {
        try {
            fetch(`https://localhost:7207/api/Cart/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                    },
                    body: JSON.stringify({
                        qty: qty
                    })
                })
                .then((res) => res.json())
                .then(data => {
                    console.log(data.message);
                    setCartItems(items =>
                        items.map(item =>
                            item.id === id ? { ...item, qty } : item
                        )
                    );
                });
        }
        catch (error) {
            console.error('發生錯誤:', error);
        }
    };

    // 刪除商品
    const removeItem = (id) => {
        try {
            fetch(`https://localhost:7207/api/Cart/remove/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                }
            })
                .then((res) => res.json())
                .then(data => {
                    console.log(data.message);
                    setCartItems(items => items.filter(item => item.id !== id));
                });
        }
        catch (error) {
            console.error('發生錯誤:', error);
        }
    };

    // 計算總金額
    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    return (
        <Row gutter={16} style={{ marginTop: '64px', height: '100vh', width: '100%', padding: '32px' }}>
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
                                        max={item.product.stock}
                                        value={item.qty}
                                        onChange={value => updateQty(item.id, value)}
                                    />,
                                    <Button danger onClick={() => removeItem(item.id)}>
                                        刪除
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.product.image} shape="square" size={64} />}
                                    title={item.product.name}
                                    description={`單價：$${item.product.price}`}
                                />
                                <div>小計：${item.product.price * item.qty}</div>
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