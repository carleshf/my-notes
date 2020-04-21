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
            id: 'no id',
            date: '',
            title: '',
            content: 'Hello **moon**!'
        }
    }

    componentDidMount = async () => {
        console.log("hello")
        const { match: { params } } = this.props;
        console.log(params)
        if(params.id === "-1" || params.id === '') {
            this.setState({
                id: '',
                date: '',
                title: 'Invalid URL',
                content: 'The content you are looking for **is not available**'
            })
        } else {
            const note = (await axios.get(`http://localhost:8081/public/${params.id}`)).data
            console.log(">", note)
            this.setState({
                id: note.id,
                date: note.date,
                title: note.title,
                content: note.content,
                nickname: note.nickname,
                author: note.author
            })
        }
    }

    render = () => {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>{ this.state.title }</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <em>{ this.state.author }</em>
                    </Col>
                </Row>
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