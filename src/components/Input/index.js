/*
 * input
 */

'use strict';
import Cursor from '../Cursor';
import React, { Component } from 'react';

import './index.css';

export default class Input extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputWidth: 0,
            contentWidth: 0,
            isScroll: false,
            isFocus: this.props.isFocus
        };
    }

    componentDidMount(){
        // this.refs.ScrollInput && this.textScroll();
    }

    componentWillReceiveProps(nextProps) {

        let {isFocus} = nextProps;
        if (isFocus !== undefined) {

            this.setState({isFocus: isFocus});
        }
        // this.refs.ScrollInput && this.textScroll();
    }

    shouldComponentUpdate(nextProps) {

        let {text, placehold} = this.props;

        return nextProps.isFocus !== this.state.isFocus
            || nextProps.text !== text
            || nextProps.placehold !== placehold;
    }

    render() {

        let {onFocus, stylesheet} = this.props;

        let {isFocus} = this.state;

        return (
            <div ref="Input" className="input" style={isFocus ? stylesheet : {}} >
				<p className="leftMask"></p>
				{this._renderCursor(this.props, this.state)}
            </div>
        );

    }

    _renderText(text, onFocus, textStyle) {
        return (
            <span key={"text"}
                  className="text"
                  style={Object.assign({}, textStyle, this.state.textStyle)} onFocus={{onFocus}}>
                {text}
            </span>
        );
    }

    _renderPlacehold(placehold, onFocus) {
        return (
            <span key={"Placehold"} className="placehold" onPress={onFocus}>{placehold} </span>
        );
    }

    _renderCursor(isFocus) {

        return (isFocus ?
                <Cursor key={"cursor"} autoFocus={isFocus}/> : <span key={"cursorText"} style={{width: 2}}></span>
        );
    }
}
