import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'
import {Container, Row, InputGroup, FormControl, Button, ListGroup, Col} from 'react-bootstrap'
import Emoji from '../Emoji/Emoji'
const https = require('https')

class Notes extends Component {
    constructor(props) {
        super(props)
        this.state = { notes: [] }
    }

    async componentDidMount() {
        //console.log(`Bearer ${auth0Client.getIdToken()}`)
        const agent = new https.Agent({  
            rejectUnauthorized: false
        })
        const notes = (await axios.get(
            `${process.env.REACT_APP_NOTES_SERVER_URL_PORT}/author`, {
                httpsAgent: agent,
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}`  }
            }
        ))
        this.setState({ notes: notes.data })
    }

    /*async componentDidMount() {
        console.log(`Bearer ${auth0Client.getIdToken()}`)
        console.log("NOTES")
        const agent = new https.Agent({ rejectUnauthorized: false })
        const notes = (await axios.get(
            `${process.env.REACT_APP_NOTES_SERVER_URL_PORT}/author`, {
                httpsAgent: agent,
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
            }
        ))
        this.setState({ notes: notes.data })
    }*/

    render = () => {
        var notes = ''
        if(this.state.notes === null) {
            notes = <Row><Col></Col><Col><p>Loading notes...</p></Col><Col></Col></Row>
        }
        if(this.state.notes !== null && this.state.notes.length === 0) {
            notes = <Row><Col></Col><Col><p>No notes in your store</p></Col><Col></Col></Row>
        }
        if(this.state.notes !== null && this.state.notes.length !== 0) {
            notes = <Row><Col><ListGroup> { 
                this.state.notes.map( (note, idx) => (
                    <ListGroup.Item action key={idx}>
                        <Emoji symbol={ note.isPublic ? "📢" : "🔒" } label={ note.isPublic ? "public" : "private" }/>
                        &nbsp;
                        <Link to={'/note/' + note.shortId }>{ note.date } | { note.title } </Link>
                    </ListGroup.Item>
                ))
            } </ListGroup></Col></Row>
        }
        return (
            <Container>
                <Row> </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Text:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="What do you wanna search?"
                                aria-label="What do you wanna search?"
                                aria-describedby="basic-addon1"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary">Search notes</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <Link className="float-right" to="/note/-1"><Button variant="outline-secondary">New note</Button></Link>
                    </Col>
                </Row>
                { notes }
            </Container>
        )
    }
}

export default Notes