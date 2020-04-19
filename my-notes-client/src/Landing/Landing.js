import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import auth0Client from '../Auth'
import axios from 'axios'

class Landing extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div key={1} className="col-lg-12">
                        Welcome
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing