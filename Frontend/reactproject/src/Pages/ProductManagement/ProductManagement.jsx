import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    /* 讀取商品列表 */
    useEffect(() => {
        fetch(`https://localhost:7207/api/Products/management/list?page=${page}&pageSize=9`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data.items);
                setTotal(data.total);
            });
    }, [page]);

    if (!products) return null;

    /* 表單填入資料 */
    useEffect(() => {
        if (editingProduct) {
            form.setFieldsValue(editingProduct);
        } else {
            form.resetFields();
        }
    }, [editingProduct]);
    
    /* 刪除商品 */
    const deleteProduct = async (id) => {
        try {
            console.log(id);
            const res = await fetch(`https://localhost:7207/api/Products/management/delete?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                }
            })

            if (!res.ok) throw new Error("刪除失敗");

            setProducts(products.filter(p => p.id !== id));
            messageApi.open({
                type: 'success',
                content: '商品刪除成功',
            });
        } catch (error) {
            console.error("刪除商品時發生錯誤:", error);
            messageApi.open({
                type: 'error',
                content: '刪除商品失敗，請稍後再試',
            });
        }
    };

    /* 新增/編輯商品 */
    const handleOk = async (values) => {
        if (editingProduct) {

            /* 更新 */
            try {
                const res = await fetch(`https://localhost:7207/api/Products/management/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                    },
                    body: JSON.stringify(values),
                })

                if (!res.ok) throw new Error("更新失敗");

                setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...values } : p));
                setEditingProduct(null);
                setIsModalVisible(false);

                messageApi.open({
                    type: 'success',
                    content: '商品更新成功',
                });
            } catch (error) {
                console.error("更新商品時發生錯誤:", error);
                messageApi.open({
                    type: 'error',
                    content: '更新商品失敗，請稍後再試',
                });
            }
        } else {

            /* 新增 */
            delete values.id;
            try {
                const res = await fetch("https://localhost:7207/api/Products/management/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                    },
                    body: JSON.stringify(values),
                })
                if (!res.ok) throw new Error("新增失敗");

                const newProduct = await res.json();
                setProducts([...products, newProduct]);
                setIsModalVisible(false);
                messageApi.open({
                    type: 'success',
                    content: '商品新增成功',
                });
            } catch (error) {
                console.error("新增商品時發生錯誤:", error);
                messageApi.open({
                    type: 'error',
                    content: '新增商品失敗，請稍後再試',
                });
            }
        }
    };

    /* 表格欄位 */
    const columns = [
        {
            title: "圖片",
            dataIndex: "image",
            render: (src) => <img src={src} alt="product" style={{ width: 80, height: 80, objectFit: 'cover' }} />
        },
        { title: "名稱", dataIndex: "name" },
        { title: "價格", dataIndex: "price" },
        { title: "庫存", dataIndex: "stock" },
        {
            title: "操作",
            render: (_, record) => (
                <>
                    <Button className="m-2" onClick={() => { setEditingProduct(record); setIsModalVisible(true); }}>編輯</Button>
                    <Button danger onClick={() => deleteProduct(record.id)}>刪除</Button>
                </>
            )
        }
    ];

    return (
        <>
            {contextHolder}

            {/* 商品表格 */} 
            <Table
                className="mt-[64px]"
                dataSource={products}
                columns={columns}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: 9,
                    total: total,
                    onChange: (page) => setPage(page),
                }}
            />

            {/* 新增/編輯 商品 Modal */ }
            <Button type="primary" onClick={() => { setEditingProduct(null); setIsModalVisible(true); }}>
                新增商品
            </Button>
            <Modal
                title={editingProduct ? "編輯商品" : "新增商品"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleOk}
                >
                    <Form.Item name="id" initialValue={editingProduct?.id} hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="名稱" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="價格" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="stock" label="庫存" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="descriptions" label="描述" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="image" label="圖片 URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="分類"
                        rules={[{ required: true, message: "請選擇商品分類" }]}
                    >
                        <Select placeholder="請選擇分類">
                            <Select.Option value="accessories">飾品</Select.Option>
                            <Select.Option value="perfume">香水</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">儲存</Button>
                </Form>
            </Modal>
        </>
    );
};

export default ProductManagement;
