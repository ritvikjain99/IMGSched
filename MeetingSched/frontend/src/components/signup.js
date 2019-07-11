import React, { Component } from 'react'
import { Container, Form, Message, List, Button, Divider } from 'semantic-ui-react';
import Service from '../Services';
import GoogleSignup from './GoogleSignup';
const service = new Service();

export default class Signup extends Component {
    constructor(props){
        super(props)
        this.state = {
            error: false,
            success: false,
            errormsg: [],
        }
        this.failure = this.failure.bind(this)
        this.success = this.success.bind(this)
    }

    listError = (errorObject=undefined) => {
        var errormsg = []
        if(errorObject !== undefined){
            for(var property in errorObject){
                if(errorObject.hasOwnProperty(property))
                    errormsg.push(errorObject[property])
            }
        } 
        else
            errormsg.push("Something went wrong.")  
        this.setState({ errormsg: errormsg})
    } 


    handleChange = (event, props) =>{
        var { value, name, checked } = props
        if(checked == undefined)
            this.setState({[name]: value})
        else
            this.setState({[name]: checked})
    }

    
    handleSubmit = (event) => {
        var { first_name, last_name, is_staff, username, password, email } = this.state
        var data = {}
        data['first_name'] = first_name
        data['last_name'] = last_name
        data['is_staff'] = is_staff 
        data['username'] = username
        data['email'] = email
        data['password'] = password
        //console.log(this.state)
        service.createUser(data)
        .then(response => {
            this.success()
            //console.log(response)
        })
        .catch(error => {
            this.failure(error)
            //console.log(error.response.data)
        })
    }


    success(){
        this.setState({error: false, success: true, errormsg: []})
    }


    failure(error){
        this.setState({error: true, success: false})
        this.listError(error.response.data)
    }


    render() {
        var { error, success, errormsg } = this.state
        const warning = <List animated bulleted>
                            <List.Item>Password must contain alteast 8 characters.</List.Item>
                            <List.Item>Password mustn't be too common.</List.Item>
                            <List.Item>Password mustn't be username.</List.Item>
                        </List> 


        return (

                <Container className="ui stackable centered page grid">
                    <Container className="column twelve wide">
                        <Form warning onSubmit={this.handleSubmit} error={error} success={success}>
                            <Form.Group widths='equal' >
                                <Form.Input required label='First Name' name='first_name' placeholder='Firstname' onChange={this.handleChange}/>
                                <Form.Input required label='Last Name' name='last_name' placeholder='Lastname' onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Input required label='Email' placeholder='Valid Email' name='email' onChange={this.handleChange}/>
                            <Form.Input required label='Username' placeholder='Username' name='username' onChange={this.handleChange}/>
                            <Form.Input required label='Password' placeholder='Password' name='password' type='password' onChange={this.handleChange}/>
                            <Message
                            warning
                            header="Warning"
                            content={warning}
                            />
                            <Form.Checkbox label='Administrator' name='is_staff' onChange={this.handleChange}/>
                            
                            <Message
                            success
                            header="Success!"
                            content="Created User."
                            />
                            <Message
                            error
                            header="Action Forbidden"
                            list={errormsg}
                            />
                            <Form.Group>
                                <Form.Button icon='plus' type='submit' primary content='Signup'/>
                                <Button content='Login' icon='sign in alternate' href='/' primary/>
                            </Form.Group>
                        </Form>
                        <Divider horizontal content='OR'/>
                        <GoogleSignup 
                            success={this.success} 
                            failure={this.failure} 
                            content="Signup with Google" 
                            listError={this.listError}
                        />
                    </Container>
                </Container>
        )
    }
}
