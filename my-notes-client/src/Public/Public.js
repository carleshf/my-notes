import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import 'react-mde/lib/styles/css/react-mde-all.css'
import DOMPurify from 'dompurify'
import {Container, Row, Col} from 'react-bootstrap'
import * as Showdown from 'showdown'

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
})

class Public extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shortId: '',
            author: '',
            creationDate: '',
            updateDate: '',            
            title: 'Invalid URL',
            content: 'The content you are looking for **is not available**'
        }
    }

    componentDidMount = async () => {
        const { match: { params } } = this.props;
        console.log(params)
        if(params.id === "-1" || params.id === '') {
            this.setState({
                shortId: '',
                author: '',
                creationDate: '',
                updateDate: '',            
                title: 'Invalid URL',
                content: 'The content you are looking for **is not available**'
            })
        } else {
            const note = (await axios.get(`${process.env.REACT_APP_NOTES_SERVER_URL_PORT}/public/${params.id}`)).data
            console.log(">", note)
            this.setState({
                shortId: note.shortId,
                author: note.author,
                creationDate: note.creationDate,
                updateDate: note.updateDate,
                title: note.title,
                content: note.content
            })
        }
    }

    render = () => {
        var author = ''
        var cDate = ''
        var uDate = ''
        if(this.state.author !== undefined) {
            author = <Row><Col>by: <em>{ this.state.author }</em></Col></Row>
        }
        if(this.state.creationDate !== undefined) {
            cDate = <Row><Col>created on: <em>{ this.state.creationDate }</em></Col></Row>
        }
        if(this.state.updateDate !== undefined) {
            uDate = <Row><Col>last updated on: <em>{ this.state.updateDate }</em></Col></Row>
        }
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>{ this.state.title }</h1>
                    </Col>
                </Row>
                { author }
                { cDate }
                { uDate }
                <Row><Col>&nbsp;</Col></Row>
                <Row><Col><hr /></Col></Row>
                <Row><Col>&nbsp;</Col></Row>
                <Row>
                    <Col>
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(converter.makeHtml(this.state.content))}} ></div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withRouter(Public)