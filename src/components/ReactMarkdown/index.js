import dynamic from 'next/dynamic';
import { Anchor, Affix } from 'antd';
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';

// 需要客户端渲染
const CodeBlock = dynamic(() => import('./CodeBlock'), { ssr: false });
import ReactMarkdown from 'react-markdown';
import './github-markdown.less';
import './index.less';


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.state = {
            hideNav: false
        }
    }

    toggleNav = () => {
        this.setState({
            hideNav: !this.state.hideNav
        });
    }


    render() {

        return <div className="mark-down-wrapper"  >
            <Affix >
                <div className="nav-area" >
                    <div className="markNav-title" onClick={this.toggleNav}>文章目录</div>
                    {
                        this.state.hideNav ? null : <MarkNav
                            className="article-menu"
                            source={this.props.source}
                            headingTopOffset={80}
                        />
                    }

                </div>
            </Affix>
            <ReactMarkdown
                source={this.props.source}
                escapeHtml={false}
                renderers={{
                    code: CodeBlock,
                    // heading: HeadingBlock
                }}
                transformImageUri={this.props.transformImageUri}
            />
        </div>
    }
}
