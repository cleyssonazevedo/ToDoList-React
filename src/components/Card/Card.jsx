import React, { Component } from 'react';
import { Col, Panel, ListGroup, ListGroupItem, Checkbox } from 'react-bootstrap';
import $ from 'jquery';
import PropTypes from 'prop-types';

import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import './Card.css';
bootstrapUtils.addStyle(Panel, "custom");

export default class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.itemID,
            titulo: this.props.titulo,
            itens: this.props.itens
        }
    }

    componentWillUpdate(props, state) {
        if(typeof(Storage) !== undefined){
            var cards = JSON.parse( localStorage.getItem("cards") );
            cards[state.id] = {
                titulo: this.state.titulo,
                itens: state.itens
            };
            localStorage.setItem("cards", JSON.stringify(cards));
        }
        
    }

    render() {
        return(
            <Col xs={12} sm={6} md={4} lg={4}>
                <Panel
                    itemID={ this.props.itemID !== undefined ? this.props.itemID : null }
                    header={ this.state.titulo }
                    collapsible
                    defaultExpanded
                    bsStyle={ this.state.itens.filter((item) => item.concluido === true ).length < this.state.itens.length ? "custom" : "success" }
                >
                    <ListGroup fill>
                        { this.CriarTarefas(this.state.itens) }
                    </ListGroup>

                </Panel>
            </Col>
        );
    }

    CriarTarefas(itens) {
        return itens.map((item, index) => {
            return(
                <ListGroupItem key={ index } itemID={ index }>
                    <Checkbox 
                        checked={ item.concluido !== undefined ? item.concluido : false } 
                        inline 
                        placeholder="Marcar Concluído" 
                        onChange={ this.MarcarConcluido.bind(this) }
                    > { item.item }</Checkbox>
                </ListGroupItem>
            );
        })
    }

    MarcarConcluido(e) {
        var target = e.target;
        var itemID = $($(target).closest("li")[0]).attr("itemID");
        var card = this.state;

        card.itens[itemID].concluido = target.checked;

        this.props.onUpdate(card);
        this.setState({itens: card.itens});
    }
}

Card.propTypes = {
    titulo: PropTypes.string.isRequired,
    itens: PropTypes.array.isRequired
}