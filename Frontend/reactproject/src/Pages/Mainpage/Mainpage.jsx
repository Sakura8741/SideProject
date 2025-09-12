import { Layout } from 'antd';
const { Content } = Layout;
import DiagonalCard from './DiagonalCard';
function Mainpage() {
    return (

        <Content style={{ paddingTop: '64px' }}>
            <DiagonalCard
                img="/images/mainpage/accessories.jpg"
                title="飾品"
                text="這是商品一的描述"
                link="/accessories"
            />
            <DiagonalCard
                img="/images/mainpage/perfume.jpg"
                title="香水"
                text="這是商品二的描述"
                link="/perfume"
                reverse
            />
        </Content>
    )
}

export default Mainpage;