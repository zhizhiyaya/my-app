/*
 * Cursor
 * Input 的光标
 */

'use strict';

import React, { Component } from 'react';
import './index.css';

export default class Cursor extends Component {

    constructor(props) {
        super(props);

        this.state = {opacity: 1};
    }

    //设置透明度 模拟光标 闪烁
    componentDidMount() {

        this.setOpacity();
    }

    setOpacity() {

         this.timer = setTimeout( () => {
            let opacity = this.state.opacity;
            opacity -= .2;

            if (opacity < -0.2) { // 之所以设成阈值以外的值,是想效果有停顿的真实效果
                opacity = 1.2;
            }

            this.setState({
                opacity: opacity
            });
             this.setOpacity();
        }, 150);
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <p className="cursor" style={{opacity: this.state.opacity}}></p>
        );
    }
}
