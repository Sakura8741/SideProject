import { Layout } from 'antd';
const { Content } = Layout;
import DiagonalCard from './DiagonalCard';
function Mainpage() {
    return (

        <Content style={{ paddingTop: '64px' }}>
            <DiagonalCard
                img="/images/mainpage/accessories.jpg"
                title="飾品"
                text="細緻的線條與溫潤的光澤交織，飾品不僅是點綴，更是日常情感的低語，為每一個瞬間添上柔和的光彩。"
                link="/accessories"
            />
            <DiagonalCard
                img="/images/mainpage/perfume.jpg"
                title="香水"
                text="淡雅的香氣在空氣中流轉，如同光影停駐的時刻，香水將記憶封存於氣息之中，讓平凡的日子也能閃爍詩意。"
                link="/perfume"
                reverse
            />
        </Content>
    )
}

export default Mainpage;