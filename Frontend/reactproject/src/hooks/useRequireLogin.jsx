import { Modal } from "antd";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
export function useRequireLogin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    /* 檢查登入狀態，未登入則顯示提示框，已登入則執行callback */
    const checkLogin = (callback) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            setIsModalOpen(true); // 未登入 → 顯示提示框
            return false;
        } else {
            if (callback) callback(); // 已登入 → 執行真正功能
            return true;
        }
    };

    /* 登入提示框 */
    const LoginModal = (
        <Modal
            title="需要登入"
            open={isModalOpen}
            onOk={() => {
                setIsModalOpen(false);
                navigate('/login'); // 導向登入頁
            }}
            onCancel={() => setIsModalOpen(false)}
            okText="前往登入"
            cancelText="取消"
        >
            請先登入會員才能使用此功能。
        </Modal>
    );

    return { checkLogin, LoginModal };
}
