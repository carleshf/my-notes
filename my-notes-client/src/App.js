import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import NavBar from './NavBar/NavBar'
import Notes from './Notes/Notes'
import Landing from './Landing/Landing'
import Callback from './Callback'
import SecuredRoute from './SecuredRoute/SecuredRoute'

class App extends Component {
    render() {
        return (
            <div>
                <NavBar/>
                <Route exact path='/' component={Landing}/>
                <Route exact path='/callback' component={Callback}/>
                <SecuredRoute path='/notes' component={Notes} />
            </div>
        )
    }
}

export default App