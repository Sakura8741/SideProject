import { Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import './DiagonalCard.css';

const { Title } = Typography;
function DiagonalCard({ img, title, text, link, reverse }) {
    return (

        /* 整體卡片容器 */
        <div className={`card ${reverse ? 'reverse' : ''}`} >
            <Row>

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
                    className="flex items-center"
                >
                    <div className={`card-content ${reverse ? 'reverse' : ''}`} >
                        <Title level={2}>{title}</Title>
                        <p>{text}</p>
                        <Link to={link} className="card-link">查看詳情</Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default DiagonalCard;
