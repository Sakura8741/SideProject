import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Form, Input, message } from 'antd'
import { useUser } from '../../context/UserContext';

const { Title } = Typography;


function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { login } = useUser();


    const onLoginFinish = async (values) => {
        try {
            const res = await fetch('https://localhost:7207/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account: values.account, password: values.password })
            });
            if (!res.ok) {
                const errorData = await res.json();
                messageApi.open({
                    type: 'error',
                    content: `登入失敗，${errorData.message}`,
                });
                return;
            }

            const token = await res.json();
            
            const payloadBase64 = token.token.split('.')[1];
            const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(payloadJson);
            login(payload.username, payload.userId, payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"], token.token);

            messageApi.open({
                type: 'success',
                content: `登入成功，歡迎回來${payload.username}`,
                duration: 1.5,
                onClose: () => navigate("/"),
            });

        } catch (error) {
            console.error('發生錯誤:', error);
            messageApi.open({
                type: 'error',
                content: '伺服器發生錯誤，請稍後再試',
            });
        }
    };
    const onRegisterFinish = async (values) => {
        try {
            const res = await fetch('https://localhost:7207/api/Users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: values.username, account: values.account, password: values.password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                messageApi.open({
                    type: 'error',
                    content: `註冊失敗，${errorData.message}`,
                });
                return;
            }

            const data = await res.json();
            console.log("註冊資訊:", data);
            messageApi.open({
                type: 'success',
                content: '註冊成功，請使用帳號登入',
            });
            setIsLogin(true);
            form.setFieldsValue({
                username: "",
                account: values.account,
                password: "",
                confirm: "",
            });
        } catch (error) {
            console.error('註冊失敗:', error);
            messageApi.open({
                type: 'error',
                content: '註冊失敗，請稍後再試',
            });
        }
    };


    return (
        /*頁面外框*/
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "#f5f5f5"
        }}>

            {/*內容外框*/}
            <div style={{
                width: 350,
                padding: 24,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                {/*註冊/登入內容*/}
                <Title level={3} style={{ textAlign: "center" }}>
                    {isLogin ? "登入" : "註冊"}
                </Title>
                {contextHolder}
                {isLogin ? (
                    /*登入*/
                    <Form layout="vertical" onFinish={onLoginFinish} form={form}>
                        <Form.Item
                            name="account"
                            label="帳號"
                            rules={[{ required: true, message: "請輸入帳號" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="密碼"
                            rules={[{ required: true, message: "請輸入密碼" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            登入
                        </Button>

                        <div style={{ textAlign: "center", marginTop: 12 }}>
                            <Link onClick={() => { setIsLogin(false), form.resetFields() }}>註冊帳號</Link>
                        </div>
                    </Form>
                ) : (
                    /*註冊*/
                    <Form layout="vertical" onFinish={onRegisterFinish} form={form}>
                        <Form.Item
                            name="username"
                            label="使用者名稱"
                            rules={[{ required: true, message: "請輸入使用者名稱" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="account"
                            label="帳號"
                            rules={[{ required: true, message: "請輸入帳號" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="密碼"
                            rules={[
                                { required: true, message: "請輸入密碼" },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.reject("請輸入密碼");
                                        if (value.length < 6) return Promise.reject("密碼長度至少 6 個字");
                                        if (!/[0-9]/.test(value) || !/[a-zA-Z]/.test(value)) {
                                            return Promise.reject("密碼需包含英文與數字");
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="確認密碼"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "請再次輸入密碼" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("兩次密碼輸入不一致"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            註冊帳號
                        </Button>

                        <div style={{ textAlign: "center", marginTop: 12 }}>
                            <Link onClick={() => setIsLogin(true)}>返回登入</Link>
                        </div>
                    </Form>
                )}
            </div>
        </div>


    );
};

export default Login;