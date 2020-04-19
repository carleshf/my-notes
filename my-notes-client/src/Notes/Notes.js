import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'
import {Container, Row, InputGroup, FormControl, Button, Pagination, ListGroup, Col} from 'react-bootstrap'
import Emoji from '../Emoji/Emoji'

class Notes extends Component {
    constructor(props) {
        super(props)

        this.state = {
            notes: null,
        }
    }

    async componentDidMount() {
        const notes = (await axios.get(
            'http://localhost:8081/author', {
                headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
        })).data
        this.setState({
            notes,
        })
    }

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
                    <ListGroup.Item action>
                    <Link  key={idx} to={'/note/' + note.id }>
                        <Emoji symbol={ note.public ? "🔓" : "🔒" } label={ note.public ? "public" : "private" }/> / { note.date } / { note.title }
                    </Link>
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