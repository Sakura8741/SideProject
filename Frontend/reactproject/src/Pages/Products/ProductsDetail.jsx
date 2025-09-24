import { useParams, Link, } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, Typography, Breadcrumb, Row, Col, InputNumber, Button, message } from 'antd'
import { useUser } from '../../context/UserContext';
import { useRequireLogin } from "../../hooks/useRequireLogin";
const { Title } = Typography;

function ProductsDetail() {
    const { categoryId, productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useUser();
    const [messageApi, contextHolder] = message.useMessage();
    const { checkLogin, LoginModal } = useRequireLogin();

    useEffect(() => {
        fetch(`https://localhost:7207/api/Products/${categoryId}/${productId}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }
        , [categoryId, productId]);

    if (!product) return null;

    const handleAddToCart = () => {
        checkLogin(() => {
            fetch('https://localhost:7207/api/Cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                },
                body: JSON.stringify({
                    userId: user.userId,
                    productId: product.id,
                    qty: quantity
                })
            })
                .then(async res => {
                    if (!res.ok)
                        messageApi.open({
                            type: 'error',
                            content: '加入購物車失敗',
                        });
                    else
                        messageApi.open({
                            type: 'success',
                            content: '成功加入購物車',
                        });
                })
                .catch(error => {
                    console.error('發生錯誤:', error);
                });
        });
    }


    const categoryNameMap = {
        accessories: '飾品',
        perfume: '香水',
    }

    const breadcrumbItems = [
        { title: <Link to="/">首頁</Link> },
        { title: <Link to={`/${categoryId}`}>{categoryNameMap[categoryId]}</Link> },
        { title: product.name },
    ]

    const descriptionsSplit = product.descriptions.split("。").map((line, index) => (
        line.trim() && <p className="mb-2" key={index}>{line}。</p>
    ));

    return (
        <>
            {/* Breadcrumb */}
            {contextHolder}
            {LoginModal}
            < Breadcrumb className='breadCrumb' separator=">" items={breadcrumbItems} />
            <Row style={{
                backgroundColor: '#F9FAFB',
                minHeight: '100vh',
                padding: '50px',
            }}>
                <Card style={{
                    width: '100%',
                    minHeight: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Row gutter={[96, 64]} >
                        <Col
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            md={{ span: 24, order: 1 }}  // 手機：圖片在上
                            lg={{ span: 12, order: 1 }}  // 桌面：圖片在左
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                    borderRadius: '20px',
                                }}
                            ></img>
                        </Col>
                        <Col
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                width: "100%",
                            }}
                            md={{ span: 24, order: 2 }}  // 手機：文字在下
                            lg={{ span: 12, order: 2 }}  // 桌面：文字在右
                        >

                            <Title level={2}>{product.name}</Title>

                            <p>{descriptionsSplit}</p>

                            <Row style={{ marginTop: "100px" }}>
                                <Col span={12}>
                                    <Title level={4}>價格: ${product.price}</Title>
                                </Col>
                                <Col span={12}>
                                    <p >庫存: {product.stock}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={{ display: 'flex' }}>
                                    <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                                    <InputNumber
                                        min={1}
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(value) => setQuantity(value)}
                                        style={{ width: '60px', }}
                                    />
                                    <Button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</Button>
                                </Col>
                                <Col span={12}>
                                    <Button onClick={handleAddToCart}>加入購物車</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card >
            </Row>
        </>
    );
};

export default ProductsDetail;  