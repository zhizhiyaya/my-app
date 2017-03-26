'use strict';

import React, { Component } from 'react';
import Input from '../../components/Input';
import Keyboard from '../../components/Keyboard';

import './index.css';

export default class Demo1 extends Component {

	render () {
		return (
			<div className="flex">
				<Input />
				<Keyboard />
			</div>
		);
	}
}
