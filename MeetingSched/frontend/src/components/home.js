import React, { Component } from 'react'
import { Button, Divider, Form, Grid, Segment, Container } from 'semantic-ui-react'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import GoogleSignup from './GoogleSignup';
import Service from '../Services';


const service = new Service();
const emptyUser = {'username': '', 'password': ''};
export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            user: emptyUser,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.success = this.success.bind(this)
        this.failure = this.failure.bind(this)
    }

    componentDidMount(){
        if(localStorage.hasOwnProperty("user"))
            this.setState({redirect: true, user: JSON.parse(localStorage.getItem("user"))})
    }


    handleSubmit(){
        var { user, redirect } = this.state
        Axios.post("http://127.0.0.1:8000/api/token/", {
            username: user.username,
            password: user.password,    
        })
        .then(response => {
            // console.log(response, "fine")
            user['refresh'] = response.data.refresh
            Axios.get(`http://127.0.0.1:8000/api/users/${user.username}`, {
                headers: {
                    "Authorization": "Bearer " + response.data.access
                }
            })
            .then(response => {
                user = {...response.data, ...user}
                localStorage.setItem("user", JSON.stringify(user))
                this.setState({redirect: !redirect, user: user})
            })
            .catch(error => {
                this.setState({user: emptyUser})
                alert("Wrong credentials!!")
                console.error("Wrong credentials!!", error)
            })
        })
        .catch(error => {
            this.setState({user: emptyUser})
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
        var { redirect } = this.state
        if(redirect === true)
            return <Redirect to={{
                       pathname: "/timeline",
                   }} />
    }

    success(user){
        // console.log(user)
        this.setState({user: user})
        service.createUser(user)
        .then(response => {
            this.handleSubmit();
        })
        .catch(error => {
            try{
                if(error.response.status === 400 || error.response.statusText === 'Bad Request'){
                    this.handleSubmit();
                }
            }
            catch{
                alert("server down")
            }
        })
    }


    failure(error){
        console.log(error)
    }



    render() {
        var { username, password } = this.state.user
        return (
            <Container>
            {this.shouldRedirect()}
            <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable verticalAlign='middle'>
                <Grid.Column>
                    <Grid.Row>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Input name='username' icon='user' iconPosition='left' label='Username' placeholder='Username' onChange={this.handleChange} value={username}/>
                    <Form.Input name='password' icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' onChange={this.handleChange} value={password}/>
                    <Button content='Login' type='submit' primary/>
                    </Form>
                    </Grid.Row>
                    <Grid.Row style={{display: 'flex', justifyContent: 'center', padding: '1 em'}}>

                        <GoogleSignup
                                success={this.success} 
                                failure={this.failure} 
                                content="Login with Google" 
                                listError={this.listError}
                        />
                    </Grid.Row>
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
