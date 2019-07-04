import React, { Component } from 'react'
import { Button, Divider, Form, Grid, Segment, Container } from 'semantic-ui-react'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            user: {},
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleSubmit(e){

        Axios.post("http://127.0.0.1:8000/api/token/", {
            username: this.state.user.username,
            password: this.state.user.password,
        })
        .then(response => {
            console.log(response, "fine")
            var user = {}
            user['refresh'] = response.data.refresh
            Axios.get(`http://127.0.0.1:8000/api/users/${this.state.user.username}`, {
                headers: {
                    "Authorization": "Bearer " + response.data.access
                }
            })
            .then(response => {
                user = {...response.data, ...user}
                this.setState({redirect: !this.state.redirect, user: user})
            })
            .catch(error => {
                alert("Wrong credentials!!")
                console.error("Wrong credentials!!", error)
            })
        })
        .catch(error => {
            console.error(error)
            alert("Wrong credentials!!")
        })
        
    }


    handleChange(e, { name, value }){
        this.setState(state => {
            state.user[name]= value
            return state
        })
    }
    

    shouldRedirect(){
        var { redirect, user } = this.state
        if(redirect === true)
            return <Redirect to={{
                       pathname: "/timeline",
                       state: user,
                   }} />
    }


    render() {
        return (
            <Container>
            {this.shouldRedirect()}
            <Segment placeholder small>
                <Grid columns={2} relaxed='very' stackable verticalAlign='middle'>
                <Grid.Column>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Input name='username' icon='user' iconPosition='left' label='Username' placeholder='Username' onChange={this.handleChange}/>
                    <Form.Input name='password' icon='lock' iconPosition='left' label='Password' type='password' onChange={this.handleChange}/>

                    <Button content='Login' type='submit' primary/>
                    </Form>
                </Grid.Column>

                <Grid.Column verticalAlign='middle'>
                    <Button content='Sign up' icon='signup' size='big' href='/signup'/>
                </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
            </Container>
        )
    }
}
