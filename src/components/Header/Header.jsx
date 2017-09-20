import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {
    render() {
        return(
            <div className="page-header">
                <h1>{ this.props.children }</h1>
            </div>
        );
    }
}