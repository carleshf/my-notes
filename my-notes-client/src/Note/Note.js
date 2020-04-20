import React, {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import {Container, Row, Col, InputGroup, FormControl, Button, Form, Badge} from 'react-bootstrap'

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
            id: 'no id',
            date: '',
            title: '',
            content: 'Hello **moon**!',
            public: false,
            tab: 'write'
        }
    }

    componentDidMount = async () => {
        const { match: { params } } = this.props;
        if(params.id !== "-1") {
            const note = (await axios.get(`http://localhost:8081/note/${params.id}`, {
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }})).data
            this.setState({
                id: note.id,
                date: note.date,
                title: note.title,
                content: note.content,
                public: note.public,
                tab: 'preview'
            })
        }
    }
    
    updateContent = (value) => {
        this.setState({
            content: value,
        })
    }

    updateTitle = (value) => {
        this.setState({
            title: value,
        })
    }

    updatePublic = (event) => {
        this.setState({
            public: event.target.checked
        })
    }

    submit = async () => {
        let current_datetime = new Date()
        let formatted_date = current_datetime.getFullYear() + "-" + appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + appendLeadingZeroes(current_datetime.getDate()) + " " + appendLeadingZeroes(current_datetime.getHours()) + ":" + appendLeadingZeroes(current_datetime.getMinutes()) + ":" + appendLeadingZeroes(current_datetime.getSeconds())

        const data = await axios.post('http://localhost:8081', {
            id: this.state.id === 'no id' ? '' : this.state.id,
            title: this.state.title,
            content: this.state.content,
            date: formatted_date,
            nickname: auth0Client.getProfile().nickname,
            author: auth0Client.getProfile().name,
            public: this.state.public
        }, {
            headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
        })
        this.setState({ id: data.data.id })
    }

    render = () => {
        var button_delete = ''
        var text_id = ''
        if(this.state.id !== 'no id') {
            button_delete = <Link to="#"><Button size = "sm" variant="outline-danger" >Delete note</Button></Link>
        } else {
            button_delete = <Link to="#"><Button size = "sm" variant="outline-danger" disabled>Delete note</Button></Link>
        }
        if(this.state.id !== 'no id') {
            text_id = <Badge variant="secondary" className="text-center">note: { this.state.id }</Badge>
        }
        return (
            <Container>
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
                                <Button variant="outline-secondary" onClick={ this.submit }>Save</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        { button_delete }
                    </Col>
                    <Col>
                        <Row className="justify-content-md-center">
                            { text_id }
                        </Row>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Check 
                                className="float-right"
                                type="switch"
                                id="custom-switch"
                                label="Public"
                                checked={this.state.public}
                                onChange={this.updatePublic}
                            />
                        </Form>
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
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col></Col>
                    <Col className="text-center">
                        <Link to="/notes"><Button variant="outline-secondary">Go to all notes</Button></Link>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        )
    }
}

export default withRouter(Note)