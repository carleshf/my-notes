import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { Container, Row, Col, InputGroup, FormControl, Button, ButtonGroup, Form, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faTrash, faCog, faSave, faTag } from '@fortawesome/free-solid-svg-icons'


const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
})

const appendLeadingZeroes = (n) => {
    if(n <= 9){
        return "0" + n;
    }
    return n
}

class Note extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shortId: 'no id',
            creationDate: '',
            updateDate: '',
            title: '',
            content: 'Hello **moon**!',
            isPublic: false,
            showCreation: true,
            showUpdate: true,
            showAuthor: true,
            saved: false,
            tab: 'write',
            showPublicModal: false,
            showDeleteModal: false,
            procSaving: false,
            history: props.history
        }
    }

    componentDidMount = async () => {
        const { match: { params } } = this.props;
        if(params.id !== "-1") {
            const note = (await axios.get(`${process.env.REACT_APP_NOTES_SERVER_URL_PORT}/note/${params.id}`, {
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }})).data
            this.setState({
                shortId: note.shortId,
                creationDate: note.creationDate,
                updateDate: note.updateDate,
                title: note.title,
                content: note.content,
                isPublic: note.isPublic,
                showCreation: note.showCreation,
                showUpdate: note.showUpdate,
                showAuthor: note.showAuthor,
                saved: true,
                tab: 'preview'
            })
        }
    }
    
    updateContent = (value) => {
        this.setState({ content: value })
    }

    updateTitle = (value) => {
        this.setState({ title: value })
    }

    setShowPublic = (flag) => { 
        this.setState({ showPublicModal: flag })
    }

    setShowDelete = (flag) => {
        this.setState({ showDeleteModal: flag })
    }

    togglePublic = () => {
        this.setState({ isPublic: !this.state.isPublic })
    }

    togglePublicCreation = () => {
        this.setState({ showCreation: !this.state.showCreation })
    }

    togglePublicUpdate = () => {
        this.setState({ showUpdate: !this.state.showUpdate })
    }

    togglePublicAuthor = () => {
        this.setState({ showAuthor: !this.state.showAuthor })
    }

    submit = async () => {
        let current_datetime = new Date()
        let formatted_date = current_datetime.getFullYear() + "-" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + appendLeadingZeroes(current_datetime.getDate()) + " " + appendLeadingZeroes(current_datetime.getHours()) + ":" + appendLeadingZeroes(current_datetime.getMinutes()) + ":" + appendLeadingZeroes(current_datetime.getSeconds())
        this.setState({ procSaving: true })

        const data = await axios.post(`${process.env.REACT_APP_NOTES_SERVER_URL_PORT}`, {
            shortId: this.state.shortId === 'no id' ? '' : this.state.shortId,
            nickname: auth0Client.getProfile().nickname,
            author: auth0Client.getProfile().name,
            creationDate: this.state.creationDate === '' ? formatted_date : this.state.creationDate,
            updateDate: formatted_date,
            title: this.state.title,
            content: this.state.content,
            isPublic: this.state.isPublic,
            showCreation: this.state.showCreation,
            showUpdate: this.state.showUpdate,
            showAuthor: this.state.showAuthor
        }, {
            headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
        })

        this.setState({ 
            shortId: data.data.shortId,
            saved: true,
            procSaving: false
        })
    }

    delete = async () => {
        await axios.delete(`${process.env.REACT_APP_NOTES_SERVER_URL_PORT}/delete/${this.state.shortId}`, {
            headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
        })
        this.state.history.push('/notes')
    }

    back = () => {
        this.state.history.push('/notes')
    }

    render = () => {
        var button_delete = ''
        var button_public = ''
        if(this.state.saved) {
            button_public = <Button size = "sm" variant="outline-secondary" onClick={ () => this.setShowPublic(true) }><FontAwesomeIcon icon={ faCog } /> Public</Button>
            button_delete = <Link to="#"><Button size = "sm" variant="outline-danger" onClick={ () => this.setShowDelete(true) }><FontAwesomeIcon icon={ faTrash } /> Delete</Button></Link>
        } else {
            button_public = <Button size = "sm" variant="outline-secondary" disabled><FontAwesomeIcon icon={ faCog } /> Public</Button>
            button_delete = <Link to="#"><Button size = "sm" variant="outline-danger" disabled><FontAwesomeIcon icon={ faTrash } /> Delete</Button></Link>
        }
        return (
            <Container>
                <Row>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <PublicModal show={ this.state.showPublicModal } onHide={ () => this.setShowPublic(false) } 
                            ispublic={ this.state.isPublic } togglepublic={ this.togglePublic }
                            showcreation={ this.state.showCreation } togglecreation={ this.togglePublicCreation }
                            showupdate={ this.state.showUpdate } toggleupdate={ this.togglePublicUpdate }
                            showauthor={ this.state.showAuthor } toggleauthor={ this.togglePublicAuthor }
                        />
                        <DeleteModal show={ this.state.showDeleteModal } onHide={ () => this.setShowDelete(false) }
                            deletenote={ this.delete }
                        />
                    </Col>
                </Row>
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Title:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="title for this note"
                                aria-label="title for this note"
                                aria-describedby="basic-addon1"
                                value={ this.state.title }
                                onChange={ (event) => this.updateTitle(event.target.value) }
                            />
                            <InputGroup.Append>
        <Button variant="outline-secondary" onClick={ this.submit }>{ this.state.procSaving ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <FontAwesomeIcon icon={ faSave } /> } Save</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}>
                        { button_delete }
                    </Col>
                    <Col></Col>
                    <Col  xs={3} className="text-right">
                        <ButtonGroup aria-label="Basic example">
                            { button_public }
                            <Button size="sm" variant="outline-secondary" disabled><FontAwesomeIcon icon={ faTag } /> Tags</Button>
                            <Button size="sm" variant="outline-secondary" onClick={ this.back }><FontAwesomeIcon icon={ faLayerGroup } /> Back to notes</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col>
                        <ReactMde
                            value={ this.state.content }
                            onChange={ this.updateContent }
                            selectedTab={ this.state.tab }
                            onTabChange={ (value) => { this.setState({ tab: value }) } }
                            generateMarkdownPreview={ markdown =>
                                Promise.resolve(converter.makeHtml(markdown))
                            }
                            /*loadSuggestions={loadSuggestions}
                            childProps={{
                                writeButton: {
                                    tabIndex: -1
                                }
                            }}*/
                        />
                    </Col>
                </Row>                
            </Container>
        )
    }
}

function PublicModal(props) {
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Public configuration
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <em>Remember to save the note in order to apply the changes from this form</em>
                        </Col>
                    </Row>
                    <Row><Col>&nbsp;</Col></Row>
                    <Row className="show-grid">
                        <Col xs={6} md={6}>
                            Make this note public?
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Check className="float-right" type="switch" 
                                id="public-switch" 
                                label={ props.ispublic ? 'Yes' : 'No' }
                                checked={ props.ispublic }
                                onChange={ props.togglepublic }
                            />
                        </Col>
                        <Col xs={4} md={4}></Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={6} md={6}>
                            Show creation date?
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Check className="float-right" type="switch" 
                                id="public-creation-switch" 
                                label={ props.showcreation ? 'Yes' : 'No' }
                                checked={ props.showcreation }
                                onChange={ props.togglecreation }
                            />
                        </Col>
                        <Col xs={4} md={4}></Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={6} md={6}>
                            Show update date?
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Check className="float-right" type="switch" 
                                id="public-update-switch" 
                                label={ props.showupdate ? 'Yes' : 'No' }
                                checked={ props.showupdate }
                                onChange={ props.toggleupdate }
                            />
                        </Col>
                        <Col xs={4} md={4}></Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={6} md={6}>
                            Show author's name?
                        </Col>
                        <Col xs={2} md={2}>
                            <Form.Check className="float-right" type="switch" 
                                id="public-author-switch" 
                                label={ props.showauthor ? 'Yes' : 'No' }
                                checked={ props.showauthor }
                                onChange={ props.toggleauthor }
                            />
                        </Col>
                        <Col xs={4} md={4}></Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={ props.onHide }>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}


function DeleteModal(props) {
    return (
        <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <p>Are you sure you want to delete this note?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button size="sm" variant="outline-danger" onClick={ props.deletenote }>Yes</Button>
                <Button size="sm" variant="outline-secondary" onClick={ props.onHide }>No</Button>
            </Modal.Footer>
        </Modal>
    )
}



/*<Modal.Header closeButton>
    <Modal.Title id="contained-modal-title-vcenter">
        Public configuration
    </Modal.Title>
</Modal.Header>*/



export default withRouter(Note)