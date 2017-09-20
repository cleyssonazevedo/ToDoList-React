import React, { Component } from 'react';
import Header from './components/Header/Header';
import Card from './components/Card/Card';
import { Button, Glyphicon, Modal, Form, FormGroup, FormControl, 
    ControlLabel, OverlayTrigger, Tooltip, ButtonGroup, Alert, Well, Col, ButtonToolbar } from 'react-bootstrap';
import $ from 'jquery';

import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import "./App.css";
bootstrapUtils.addStyle(Button, "floating");
bootstrapUtils.addStyle(Well, "nothing");

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /** List Cards */
            cards: [],

            /** Status Card */
            show_complete: true,
            filter: false,
            
            /** Card Controllers */
            titulo: "",
            tarefas: [""],
            ativo: 0,

            /** Error Handler Card */
            error: {
                titulo: false,
                tarefa: false
            },

            /** Modal Controller */
            visible: false,
            remove: false,

            /** Alerta Storage */
            alert: {
                session: false
            }
            
        }

        this.close = this.Close.bind(this);
        this.ModalOnChange = this.ModalOnChange.bind(this);
    }

    componentDidMount() {
        if(typeof(Storage) !== undefined){
            var cards = localStorage.getItem("cards");
            if(cards !== undefined && cards !== null) { 
                this.setState({
                    cards: JSON.parse(cards)
                });
            }
        } else
            this.setState({
                alert: {
                    session: true
                }
            });
    }

    componentWillUpdate(props, state) {
        if(typeof(Storage) !== undefined)
            localStorage.setItem("cards", JSON.stringify(state.cards));
    }

    Tooltip(text) {
        return (
            <Tooltip id="new_task">{ text }</Tooltip>
        );
    }

    render() {
        return(
            <div className="container-full">
                <Header>Lista de Tarefas</Header>
                <div id="cards" style={ this.state.cards.length === 0 ? { margin: "0px" } : null }>
                    {
                        this.state.cards.length === 0 || this.state.filter ?
                            <Col xs={ 8 } xsOffset={ 2 }>
                                <Well bsStyle="nothing">
                                    Nenhuma tarefa cadastrada!
                                </Well>
                            </Col>
                        : null
                    }

                    { this.Cards(this.state.cards) }
                </div>
                <OverlayTrigger placement="left" overlay={ this.Tooltip("Nova Tarefa") }>
                    <Button placeholder="Nova Tarefa" bsStyle="floating" onClick={() => this.setState({visible: true}) }><Glyphicon glyph="plus" /></Button>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={ this.Tooltip(this.state.show_complete ? "Ocultar Concluídos" : "Visualizar Concluídos") }>
                    <Button 
                        style={ this.state.cards.length === 0 ? { display: "none" } : { bottom: "14%" } } 
                        placeholder={ this.state.show_complete ? "Ocultar Concluídos" : "Visualizar Concluídos" } 
                        bsStyle="floating" 
                        onClick={ this.RemoveCard.bind(this) }><Glyphicon glyph={ this.state.show_complete ? "eye-close"  : "eye-open"} /></Button>
                </OverlayTrigger>

                <Modal 
                    show={ this.state.visible }
                    onHide={ this.close }
                    onShow={() => $("input[name='titulo'").focus()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Nova Tarefa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup controlId="group-titulo" validationState={ this.state.error.titulo === true ? "error" : null }>
                                <ControlLabel>Título</ControlLabel>
                                <FormControl 
                                    type="text" 
                                    name="titulo"
                                    tabIndex={1}
                                    placeholder="Título para a nova tarefa" 
                                    onChange={ this.ModalOnChange }
                                    value={ this.state.titulo } />
                            </FormGroup>

                            <fieldset style={{marginTop: "45px"}}>
                                <legend style={{fontSize: "16px"}}>
                                    Tarefas  <ButtonToolbar className="pull-right" style={{ marginRight: "20px" }} >
                                    <ButtonGroup>
                                        <Button
                                            tabIndex={5}
                                            bsSize="small" 
                                            placeholder="Nova Tarefa"
                                            onClick={ this.ModalAddTarefa.bind(this) }
                                            >Novo</Button>
                                        <Button
                                            tabIndex={6}
                                            bsSize="small"
                                            disabled={ this.state.tarefas.length === 1 ? true : false }
                                            onClick={ this.ModalRemoveTarefa.bind(this) }
                                        >Remover</Button>
                                    </ButtonGroup>

                                    <ButtonGroup>
                                        <Button
                                            bsSize="small"
                                            tabIndex={7}
                                            disabled={ this.state.tarefas.length === 1 || this.state.ativo === 0 ? true : false }
                                            onClick={ this.ModalTarefaAnterior.bind(this) }
                                        >Anterior</Button>

                                        <Button
                                            bsSize="small"
                                            tabIndex={8}
                                            disabled={ this.state.tarefas.length === 1 || this.state.ativo + 1 === this.state.tarefas.length ? true : false }
                                            onClick={ this.ModalTarefaProxima.bind(this) }
                                        >Próximo</Button>
                                    </ButtonGroup>
                                </ButtonToolbar>

                                </legend>
                                { this.ModalTarefas() }
                            </fieldset>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonGroup>
                            <Button 
                                tabIndex={3}
                                onClick={ this.close }>Cancelar</Button>
                            <Button 
                                type="submit" 
                                bsStyle="primary" 
                                tabIndex={4}
                                onClick={ this.ModalNovoCard.bind(this) }>Nova Tarefa</Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Modal>


                <Modal
                    id="remover"
                    show={ this.state.remove }
                    onHide={ this.CloseDialog.bind(this) }
                >
                    <Modal.Header>Remover Tarefas Concluídas</Modal.Header>
                    <Modal.Body>
                        Esta opção remove todas as tarefas completas, deseja realmente fazer isto?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={ this.CloseDialog.bind(this) }>Não</Button>
                        <Button bsStyle="primary" onClick={ this.RemoveConcluidos.bind(this) }>Sim</Button>
                    </Modal.Footer>
                </Modal>
                {
                    /* Alerta em caso de navegado não compatível com Storage */
                    this.state.alert.session ?
                    <div className="container" 
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            left: "20px"
                        }}>
                        <Alert bsStyle="warning" onDismiss={() => this.setState({alert: {session: false}})}>
                            <h4>Recurso não presente!</h4>
                            <p>Você está utilizando um navegador sem um recurso que permite 
                                salvar os dados na sessão, recomenda-se atualizar ou trocar de 
                                navegador para uma melhor experiência.</p>
                        </Alert>
                    </div>
                    : null
                }
            </div>
        );
    }

    RemoveCard() {
        this.setState({
            remove: false,
            show_complete: !this.state.show_complete
        });
    }

    RemoveConcluidos() {
        console.log(this.state.cards);
        this.setState({
            remove: false,
            show_complete: false
        });
    }

    CloseDialog() {
        this.setState({
            remove: false
        });
    }
    
    ModalNovoCard(e) {
        e.preventDefault();

        var error = this.state.error

        /* Busca tarefas em branco e coloca como nulo */
        var tarefas = this.state.tarefas.map((tarefa) => {
            return tarefa.trim() !== "" ? {
                item: tarefa
            } : null;
        });

        /* Remove as tarefas em branco */
        tarefas = tarefas.filter((tarefa) => tarefa !== null);


        /* Em caso de Título em Branco! */
        if(this.state.titulo.trim() === "")
            error.titulo = true;
        else
            error.titulo = false;

        /* Em caso de todas as tarefas em branco */
        if(tarefas.length === 0)
            error.tarefa = true;
        else
            error.tarefa = false;
        

        if(error.titulo === true || error.tarefa === true){
            this.setState({
                error: error
            });
            return;
        }

        var novo = {
            titulo: this.state.titulo,
            itens: tarefas
        }

        var cards = this.state.cards;
        cards.push(novo);

        this.setState({
            visible: false,
            titulo: "",
            tarefas: [""],
            cards: cards,
            ativo: 0
        });
    }

    ModalRemoveTarefa() {
        var tarefas = this.state.tarefas.filter((item, index) => { return index !== this.state.ativo } );
        this.setState({
            tarefas: tarefas,
            ativo: tarefas.length - 1
        });
    }

    ModalTarefaAnterior() {
        this.setState({
            ativo: this.state.ativo - 1
        });
    }

    ModalTarefaProxima() {
        this.setState({
            ativo: this.state.ativo + 1
        });
    }

    ModalTarefas() {
        return (
            <FormGroup controlId="group-tarefa" validationState={ this.state.error.tarefa === true ? "error" : null }>
                <FormControl 
                    componentClass="textarea"
                    tabIndex={2} 
                    name="tarefa" 
                    placeholder={ "Tarefa " + ( this.state.ativo + 1 ) } 
                    onChange={ this.ModalOnChangeTarefas.bind(this) }
                    value={ this.state.tarefas[ this.state.ativo ] } />
            </FormGroup>
        );
    }

    ModalAddTarefa() {
        var state_tarefas = this.state.tarefas;
        state_tarefas.push("");

        var ativo = this.state.ativo + 1;

        this.setState({
            tarefas: state_tarefas,
            ativo: ativo
        });
    }

    ModalValidationTitulo() {
        if(this.state.modal.titulo === "")
            return "danger";
    }

    ModalOnChange(e) {
        const target = e.target;

        $(target).closest(".form-group").removeClass("has-error");
        this.setState({
            [target.name]: target.value
        })
    }

    ModalOnChangeTarefas(e) {
        $(e.target).closest(".form-group").removeClass("has-error");
        var itemID = this.state.ativo;
        var tarefas = this.state.tarefas;

        tarefas[itemID] = e.target.value;
        this.setState({
            tarefas: tarefas
        });
    }

    Cards(cards) {
        if(!this.state.show_complete) {
            var filtro = cards.map((item, index) => {
                if(item.itens.filter((i) => i.concluido === true).length !== item.itens.length)
                    return {
                        id: index,
                        titulo: item.titulo,
                        itens: item.itens
                    };
                else
                    return null;
            }).filter((item) => item !== null);

            var novo = filtro.map((item) => {
                return (
                    <Card 
                        titulo={ item.titulo } 
                        itens={ item.itens } 
                        key={ item.id } 
                        itemID={ item.id } 
                        onRemove={ this.Remove.bind(this) } 
                        onUpdate={ this.UpdateCard.bind(this) }
                    /> 
                );
            });

            if(novo.length !== 0)
                return novo;
            else
                return (
                    <Col xs={ 8 } xsOffset={ 2 }>
                        <Well bsStyle="nothing">
                           Todas as tarefas estão concluídas!
                        </Well>
                    </Col>
                );
        }

        return cards.map((item, index) => {
            return (
                <Card 
                    titulo={ item.titulo } 
                    itens={ item.itens } 
                    key={ index } 
                    itemID={ index } onRemove={ this.Remove.bind(this) } 
                    onUpdate={ this.UpdateCard.bind(this) }
                />
            );
        });
    }

    Remove(id) {
        var cards = this.state.cards;
        cards = cards.filter((item, index) => { return index !== id} );
        this.setState({
            cards: cards
        });
    }

    UpdateCard(card) {
        this.forceUpdate();
    }

    Close() {
        this.setState({
            visible: false,
            titulo: "",
            tarefas: [""],
            ativo: 0,
            error: {
                titulo: false,
                tarefa: false
            }
        });
    }
}