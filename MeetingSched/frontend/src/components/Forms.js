import React, { Component } from 'react';
import { Form, Checkbox, Button, Container, Input, Dropdown, Message } from 'semantic-ui-react';
import Service from '../Services';
import RefreshedToken from './RefreshToken';

var service = new Service();

export default class MeetingForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: '',
            time: '',
            isPrivate: false,
            meeting_description: '',
            invited: [],
            stateOptions: [],
            error: false,
            success: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleDropdown = this.handleDropdown.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleDropdown(event, { value }){
        this.setState({ invited: value })
    }

    handleSubmit(event){
        var data = {}
        var { meeting_description, isPrivate, invited, time, date } = this.state
        data['meeting_description'] = meeting_description
        data['admin'] = this.props.user.id
        data['isPrivate'] = (isPrivate ? "True":"False")
        data['invited'] = invited
        data['meeting_time'] = date+"T"+time+"Z"
        RefreshedToken(this.props.user.refresh).then(response => {
            service.createMeeting(data, response.data.access).then(response => {
                console.log(response.data)
                this.setState({error: false, success: true})
            })
            .catch(error => {
                console.log(error.status)
                this.setState({error: true, success: false})
            })
        })
        
    }

    handleChange(event, props){
        var { name } = props
        if(name === 'isPrivate')
            this.setState({ isPrivate: props.checked })
        else
            this.setState({ [props.name]: props.value })
    }


    updateUsers(){
        RefreshedToken(this.props.user.refresh)
        .then(response => {
            service.getUsers(response.data.access)
            .then(response => {
                this.setState({stateOptions: response.map(user => {return {key: user.id, value: user.id, text: user.username}})})
            })
        })
        
    }

    componentDidMount(){
        this.updateUsers();
    }
    
    render() {
        var { error,success }  = this.state
        return (
            <Container>
            <Form onSubmit={this.handleSubmit} error={error} success={success}>
                <Form.Field required >
                    <Input label='Date' placeholder='YYYY-DD-MM' name='date' onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field required>
                    <Input label='Time' placeholder='HH:MM:SS' name='time' onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field required>
                    <Checkbox label='Private' name='isPrivate' onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field required>
                    <Input label='Description' placeholder='Write something ...' name='meeting_description' onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field required>
                <Dropdown
                    placeholder='Invited'
                    fluid
                    multiple
                    search
                    selection
                    upward={false}
                    options={this.state.stateOptions}
                    onChange={this.handleDropdown}
                />
                </Form.Field>
                <Button type='submit' primary>Create Meeting</Button>
                <Message
                success
                header="Success!"
                content="Created meeting."
                />
                <Message
                error
                header="Action Forbidden"
                content="Wrong Credentials."
                />
            </Form>
            </Container>
        )
    }
}
