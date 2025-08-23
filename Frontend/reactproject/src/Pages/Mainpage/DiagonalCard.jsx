import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import './DiagonalCard.css'; // 你原本的樣式（clip-path 可以保留）

function DiagonalCard({ img, title, text, link, reverse }) {
    return (
        <div className={`card ${reverse ? 'reverse' : ''}`} >
            <Row gutter={[16, 16]} align="middle">
                {/* 圖片區塊 */}
                <Col
                    xs={{ span: 24, order: 1 }}                // 手機：圖片在上
                    md={{ span: 12, order: reverse ? 2 : 1 }}  // 桌面：依 reverse 交換
                >
                    <div className={`card-image ${reverse ? 'reverse' : ''}`}>
                        <img src={img} alt={title} />
                    </div>
                </Col>

                {/* 文字區塊 */}
                <Col
                    xs={{ span: 24, order: 2 }}                // 手機：文字在下
                    md={{ span: 12, order: reverse ? 1 : 2 }}  // 桌面：依 reverse 交換
                >
                    <div className={`card-content ${reverse ? 'reverse' : ''}`}>
                        <h2>{title}</h2>
                        <p>{text}</p>
                        <Link to={link} className="card-link">查看詳情</Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default DiagonalCard;
