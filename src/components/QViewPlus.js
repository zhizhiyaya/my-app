import { View , ScrollView, Text,Modal } from 'react-native'
import {Loading, Keyboard, Tips, PopupSelect, PopupView} from './index';
import SIZE from '../config/const'

export default class Container extends Component {

    styles = styles;

    constructor(props) {
        super(props);

        this.state = {
            'popComponentQueue': [],
            'renderComponent': this.props.renderComponent
        };
    }

    componentWillReceiveProps(nextProps) {
        let state = {};

        if (nextProps.renderComponent !== undefined) {
            state.renderComponent = nextProps.renderComponent;
        }

        //if (nextProps.showTips) {
        //    state.showTips = nextProps.showTips;
        //}
        this.setState(state);
    }

    shouldComponentUpdate(nextProps, nextState) {

        //console.log(!mm.objectEqual(nextProps, this.props), !mm.objectEqual(nextState, this.state));
        return !mm.objectEqual(nextProps, this.props)
            || !mm.objectEqual(nextState, this.state);
    }

    render() {

        let isLoading = this.props.loading && this.props.loading.isShow || false,
            loadingContent = this.props.loading && this.props.loading.content || null;

        let {renderComponent} = this.state;

        let {isShow, content, duration} = this.props.showTips || {};

        return (
            <View class="container" onPress={() => {

                    this.props.hidePopComponent && this.props.hidePopComponent();
                    !this.props.hidePopComponent && this.state.renderComponent !== null && this.setState({'renderComponent': null});
                    //this.props.setMaskShow && this.props.setMaskShow( false );
                }}>
                <View class="children" style={this.props.style}>
                    {this.props.children}
                </View>

                {
                    this.props.isShowMask ? <View class="mask" style={{height: SIZE.SCREEN_HEIGHT}} /> : null
                }

                {/* 此处的排列按照层级优先级排的, loading 优先级最高, tips 其次, 其他弹出层更低*/}
                {(!!renderComponent || this.state.popComponentQueue.length > 0) && this.getPopComponnent(renderComponent)}



                <Tips isShow={isShow} content={content} duration={duration}/>
                <Loading isLoading={isLoading} content={loadingContent} ref="loading"/>


            </View>
        )
    }

    getPopComponnent(curShowComponnent) {

        let {popComponentQueue} = this.state;

        // 前后推进来的是相同的组件则不再重新 set, 直接 render
        if (!!curShowComponnent && !!popComponentQueue[popComponentQueue.length - 1]
            && curShowComponnent().key === popComponentQueue[popComponentQueue.length - 1]().key){
            return this._renderPopComponent();
        }

        // 一个入队 一个出队
        // (为 null 时,队列内的组件需收起,所以把 null push 进去占位)
        popComponentQueue.push(curShowComponnent);

        // 出队条件: 当前队列多于两个
        // ( 页面正常情况下只会有一个 popup 层, 交替时也只有两个, 所以 新入队后的长度大于 2 就应一个出队)
        if (popComponentQueue.length > 2) {
            popComponentQueue.shift();
        }

        this.state.popComponentQueue = popComponentQueue;

        return this._renderPopComponent();
    }

    _renderPopComponent() {
        let {popComponentQueue} = this.state;
        let len = popComponentQueue.length;

        let queue = popComponentQueue.map((item, index) => {
            // item 可为 null 或 为可 return 一个组件的 function,
            // 为 null 时,占位最后一个, 则之前的组件会收起
            // 为 Fn 时 返回一个 pop 组件
            if (index === len - 1) {

                return !!item ? item(true) : item;
            }
            return !!item ? item(false) : item;
        });

        return queue;
    }
}

let styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebecee'
    },
    children: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    mask: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        opacity: .1,
        backgroundColor : '#000'
    }
};


global.Container = Container;
