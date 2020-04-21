import React from 'react'
import {withRouter} from 'react-router-dom'
import auth0Client from '../Auth'
import {Navbar, Button} from 'react-bootstrap'
import Emoji from '../Emoji/Emoji'

function NavBar(props) {
    const signOut = () => {
        auth0Client.signOut()
        props.history.replace('/')
    }

    var label = ''
    var status = ''
    if(!auth0Client.isAuthenticated()) {
        status = <Button variant="outline-light" onClick={auth0Client.signIn}>Sign In</Button>
    } else {
        label = <Navbar.Text>{auth0Client.getProfile().name}</Navbar.Text>
        status = <Button variant="outline-light" onClick={() => {signOut()}}>Sign Out</Button>
    }

    return (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand><Emoji symbol="📝" label="Notes!" /></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                { label }<Navbar.Text>&nbsp;</Navbar.Text>{ status }
            </Navbar.Collapse>
        </Navbar>
    )
}

export default withRouter(NavBar);