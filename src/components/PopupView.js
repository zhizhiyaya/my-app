import { View, Text, Dimensions } from 'react-native'
import { Animated } from 'react-native'
import SIZE from '../config/const'
import {DeviceInfo} from 'react-native';


let defaultViewHeightPercent = 0.65;
let baseHeight = SIZE.SCREEN_HEIGHT;


export default class PopupView extends Component {

    styles = styles;

    constructor(props, context) {
        super(props, context);

        let screenSize = this.updateSize(defaultViewHeightPercent);
        this.state = {
            hideOnMaskPress: true,
            isShow: props.isShow || false,
            viewHeightPercent: 0.65,
            fadeAni: new Animated.Value(screenSize.screenHeight),
            ...screenSize
        };

        //-screenSize.screenHeight
    }

    updateSize(viewHeightPercent){

        let viewHeight = baseHeight * viewHeightPercent,
            maskHeight = baseHeight * (1-viewHeightPercent),
            viewTop = maskHeight;

        return {
            screenHeight : baseHeight,
            screenWidth : SIZE.SCREEN_WIDTH,
            viewHeight : viewHeight,
            maskHeight : maskHeight,
            viewTop : maskHeight
        }
    }

    hideWidget() {
        if (this.state.hideOnMaskPress) {
            this.hide();
        }
    }

    hide() {
        this.setState({
            isShow: false
        })
        this.props.onClose && this.props.onClose()
    }

    componentWillMount() {
        if (this.props.viewHeight && !isNaN(this.props.viewHeight)) {
            this.setState({
                viewHeightPercent: this.props.viewHeight
            })
            this.updateSize();
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isShow: nextProps.isShow
        })
    }

    onIconPress(){
        this.props.onHeaderIconPress && this.props.onHeaderIconPress();
        this.setState({
            isShow : false
        })
    }

    render() {

        let me = this;
        let _top = this.state.isShow ? 0 : this.state.screenHeight;
        Animated.timing(
            this.state.fadeAni,
            {
                toValue: _top
                // duration: 500
            }
        ).start();

        return (
            <Animated.View class="container" style={{
                top : this.state.fadeAni
            }}>

                <View class="view"
                      style={{
                        height : this.state.viewHeight,
                        bottom : 0
                    }}
                >
                    {
                        this.props.hasHeader ?
                        <View class="header">
                            <View onPress={ this.onIconPress.bind(this) } class="headerIcon">
                                <Icon stylesheet={{
                                    color : '#999',
                                    fontSize : 16
                                }} fontCode="&#xf077;" />
                            </View>
                            <Text class="headerTitle">{this.props.title || ""}</Text>
                        </View> : null
                    }
                    { this.props.children || null }
                </View>
            </Animated.View>
        )
    }
}




let styles = {
    container : {
        height : baseHeight,
        width : SIZE.SCREEN_WIDTH,
        top : 0,
        left : 0,
        right : 0,
        position : 'absolute'
    },
    view : {
        backgroundColor : '#fff',
        position : 'absolute',
        left : 0,
        right : 0,
        color : 'red',
        opacity : 1,
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-start'
    },
    text : {
        color : ''
    },
    header : {
        height : 40,
        borderBottomWidth : 1,
        borderBottomColor : '#eee',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center'
    },
    headerIcon : {
        position : 'absolute',
        left : 0,
        height : 40,
        paddingLeft : 15,
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    headerTitle : {
        color : '#212121',
        fontSize : 16
    }
}
