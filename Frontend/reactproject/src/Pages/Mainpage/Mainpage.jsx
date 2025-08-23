import { Layout } from 'antd';
const { Content } = Layout;
import DiagonalCard from './DiagonalCard';
function Mainpage() {
    return (

        <Content style={{ paddingTop: '60px' }}>
            <DiagonalCard
                img="https://picsum.photos/500/400"
                title="商品一"
                text="這是商品一的描述"
                link="#"
            />
            <DiagonalCard
                img="https://picsum.photos/500/400"
                title="商品二"
                text="這是商品二的描述"
                link="#"
                reverse
            />
        </Content>
    )
}

export default Mainpage;