import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'

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

    render() {
        return (
            <div className="container">
                <div className="row">
                    {
                        this.state.notes === null && <p>Loading notes...</p>
                    }
                    {
                        this.state.notes !== null && this.state.notes.length == 0 && <p>No notes in your store</p>
                    }
                    {
                        this.state.notes && this.state.notes.map(note => (
                            <div key={note.id} className="col-sm-12 col-md-4 col-lg-3">
                                <Link to={`/note/${note.id}`}>
                                    <div className="card text-white bg-success mb-3">
                                        <div className="card-header">Answers: {note.answers}</div>
                                        <div className="card-body">
                                            <h4 className="card-title">{note.title}</h4>
                                            <p className="card-text">{note.content}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Notes