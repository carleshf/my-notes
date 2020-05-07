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
        console.log('1')
        this.state = {
            shortId: '',
            author: '',
            creationDate: '',
            updateDate: '',            
            title: 'Invalid URL',
            content: 'The content you are looking for **is not available**'
        }
        console.log('2')
    }

    componentDidMount = async () => {
        console.log('3')
        const { match: { params } } = this.props
        console.log('4')
        if(params.id === "-1" || params.id === '') {
            console.log('5A')
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
            console.log('5B')
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
        console.log('6')
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
        console.log('7')
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