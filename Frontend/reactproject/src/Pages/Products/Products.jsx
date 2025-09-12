import { Breadcrumb, Layout, Menu, Card, Pagination, Typography } from 'antd';
import { Link, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import './Products.css';

const { Title } = Typography;
const { Sider, Content } = Layout;

const menuItems = [
    { key: "accessories", label: <Link to="/accessories">飾品</Link> },
    { key: "perfume", label: <Link to="/perfume">香水</Link> },
];
function Products() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 9;

    useEffect(() => {
        fetch(`https://localhost:7207/api/Products?category=${categoryId}&page=${page}&pageSize=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.items);
                setTotal(data.total);
            });
    }, [categoryId, page]);

    const categoryNameMap = {
        accessories: '飾品',
        perfume: '香水',
    }

    const breadcrumbItems = [
        { title: <Link to="/">首頁</Link> },
        { title: categoryNameMap[categoryId] },
    ]


    return (
        <>
            {/* Breadcrumb */}
            <Breadcrumb className='breadCrumb' separator=">" items={breadcrumbItems} />

            <Layout className="productslayoutStyle" width={200}>
                {/* Sider */}

                <div className="p-0 md:p-5">
                    <Sider className="siderStyle" breakpoint="md" collapsedWidth="0" >
                        <Menu
                            className="menuStyle"
                            mode="inline"
                            selectedKeys={[location.pathname.replace("/", "")]}
                            items={menuItems}
                        />
                    </Sider>
                </div>

                {/* Content */}
                <Content style={{ padding: '0px 24px' }}>
                    {/* 商品 3x3 Grid */}
                    <Title className="flex justify-center mt-4 titleStyle" level={3}>商品類別:{categoryNameMap[categoryId]}</Title>
                    <div className="grid md:grid-cols-3 gap-4 w-full sm:grid-cols-1">
                        {products.map((p) => (
                            <Link key={p.id} to={`/${categoryId}/${p.id}`}>
                                <Card key={p.id} hoverable className="card-fixed" bodyStyle={{ padding: '12px' }}>
                                    <div className="w-full h-80 overflow-hidden rounded-md">
                                        <img src={p.image} alt={p.name} className="w-full h-80 object-cover" />
                                    </div>
                                    <h3>{p.name}</h3>
                                    <p>價格: ${p.price}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>


                    {/* 分頁列 */}
                    <div className="flex justify-center m-6">
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={total}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                </Content>
            </Layout>
        </>


    )
}
export default Products;