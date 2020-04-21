import React, {Component} from 'react'
import {Container, Row, Col, Image} from 'react-bootstrap'

class Landing extends Component {
    render() {
        return (
            <Container>
                <Row className="text-center">
                    <Col>Welcome to <em>Notes!</em></Col>
                </Row>
                <Row><Col>&nbsp;</Col></Row>
                <Row className="text-center">
                    <Col><Image width={500} src={ process.env.PUBLIC_URL + '/img/undraw_random_thoughts_xejj.svg'} responsive></Image></Col>
                </Row>
            </Container>
        )
    }
}

export default Landing