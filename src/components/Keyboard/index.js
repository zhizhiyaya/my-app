/*
 * Keyboard
 * 改变数据时, changeNum -> action -> state -> div (点击 删除 数字)
 * 收起, 仅收起弹框;
 * 确定时 给个回调
 */

'use strict';
import React, { Component } from 'react';
import './index.css';

let KEYBOARD_HEIGHT = (window.innerHeight || document.documentElement.clientHeight) * 0.32;
let OPTLIST_WIDTH = (window.innerWidth|| document.documentElement.clientWidth) * 0.265;

export default class Keyboard extends Component {
	constructor(props) {
        super(props);

        let keyboardBottom = this.props.visibleStatus ? -KEYBOARD_HEIGHT : 0;

        let closeItem = this.props.hasClose !== false ? '\uf547' : ''; // 收起键盘的 div
        let piontItem = this.props.hasPoint ? '.' : ''; // 小数点 的 div
        this.state = {
            nums: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [ piontItem, 0, closeItem]],
            opts: ['\uf545', '确定'],
            // fadeAnim: new Animated.Value(keyboardBottom),
            visibleStatus: this.props.visibleStatus
        };
    }

	// 只会在组件mount以后执行一次
    // 相当于 css 动画组的 componentWillAppear 阶段
    componentDidMount() {

        let value = this.props.visibleStatus ? 0 : -KEYBOARD_HEIGHT;
        this.animatePanel(value);
    }

	componentWillReceiveProps(nextProps) {
        let {visibleStatus} = nextProps;
        let visible = this.state.visibleStatus;

        if (nextProps.visibleStatus !== visible) {
            this._setvisibleStatus(visibleStatus);
            let value = visibleStatus ? 0 : -KEYBOARD_HEIGHT;
            this.animatePanel(value);
        }
    }

	shouldComponentUpdate(nextProps, nextState) {

        return nextState.visibleStatus !== this.state.visibleStatus;
    }

	render () {
		let {nums, opts} = this.state;
        let {hasPoint} = this.props; // 是否需要小数点
        let numsLen = nums.length,
            lastNumLen = nums[numsLen - 1].length;

		return (
			<div className="container" style={{height: KEYBOARD_HEIGHT + 'px'}}>
				<div className="numList">
					{nums.map((item, index) =>
						<div key={index} className="numGird">
							{item.map((elem, i) => {
								if (index === numsLen - 1 && i === lastNumLen - 1) {
									return this.props.hasClose !== false ? <div key={i} activeOpacity={0.5} className="num" onPress={this.props.onClose}><div
										className="numText"><div fontCode={elem} className="icon" /></div></div>
										: <div key={i} className="num"></div>
								}

								return <div key={i} activeOpacity={0.5} className="num"
														 onPress={this.changeNums.bind(this, 'add', elem)}><div
									className="numText">{elem}</div></div>
							})
							}
						</div>
					)}
				</div>
				<div className="optList" style={{width: OPTLIST_WIDTH + 'px'}}>

                    {
                        opts.map((item, i) => {
                            if (i === 0) {
                                return (<div key={"optList0"} activeOpacity={0.5} className="opt" onPress={this.changeNums.bind(this, 'del')}><div
                                    className="optText"><div fontCode={item} className="icon"/></div></div>);
                            } else if (i === 1) {
                                return (<div key={"optList1"} activeOpacity={0.5} className="opt okWrap" onPress={() =>{
                                            this.submit()
                                        }}>
                                            <div className="optText ok">{item}</div>
                                        </div>);
                            }
                        }
                    )}
                </div>
			</div>
		);
	}

	changeNums(changeType, n) {
		if (this.props.change) {
			return this.props.change();
		}
        if (n === '') {return ;}
        let {num, hasPoint, fixLen} = this.props;
        switch (changeType) {
            case 'del':
                num = num.toString().substring(0, num.length - 1);
                this.props.onChange(num);
                break;
            case 'add':
                let pointIndex = num.toString().indexOf('.');
                let len = num.toString().length;

                //  有 小数点
                if (hasPoint && (!Number.isNaN(num))) {

                    num = !Number(num) && pointIndex <= -1 ? '' : num;
                    if (!num  && n === '.' ) {
                        num = '0.';
                    } else if (pointIndex <= -1 || n !== '.') {
                        num = num.toString() + n
                    }
                    let _fixLen = fixLen || 3; // 保留小数点后 n-1  位，非四舍五入
                    num = pointIndex > -1 ? num.substring(0, pointIndex + _fixLen) : num;
                } else {
                    num = !!num ? (num.toString() + n) : n;
                }
                this.props.onChange(num);
                break;
            default:
                break;
        }
    }

    submit(){
        this.props.onSubmit && this.props.onSubmit(this.props.num)
    }

    animatePanel(value) {

        // Animated.timing(
        //     this.state.fadeAnim,
        //     {
        //         toValue: value
        //     }
        // ).start();
    }
	_setvisibleStatus(visibleStatus) {
        this.setState({'visibleStatus': visibleStatus});
    }
}
