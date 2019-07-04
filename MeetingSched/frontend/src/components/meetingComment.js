import React, { Component } from 'react'
import Service from '../Services';
import { Button, Comment, Form, Header, Container } from 'semantic-ui-react'


const service = new Service();
export default class meetingComment extends Component {
    constructor(props){
        super(props)
    }
    
    
    render(){
        return(
            <Container>
                <Comment.Group size='tiny'>
                    <Header size='small' dividing>
                    Comments
                    </Header>

                    <Comment>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <Comment.Content>
                        <Comment.Author as='a'>Matt</Comment.Author>
                        <Comment.Metadata>
                        <div>Today at 5:42PM</div>
                        </Comment.Metadata>
                        <Comment.Text>How artistic!</Comment.Text>
                        <Comment.Actions>
                        <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                    </Comment>

                    <Form reply>
                    <Form.TextArea/>
                    <Button content='Add Reply' labelPosition='left' icon='edit' primary size='mini'/>
                    </Form>
                </Comment.Group>
            </Container>
        );
    }
}
