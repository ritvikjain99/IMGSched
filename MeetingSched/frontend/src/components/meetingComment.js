import React, { Component } from 'react'
import { Comment, Header, Input, Icon } from 'semantic-ui-react'


export default class FeedComment extends Component {
    constructor(props){
        super(props)
        this.state = {
            comment: '',
            comments: this.props.comments,
        }
        this.handleChange = this.handleChange.bind(this)
        this.onComment = this.onComment.bind(this)        
    }
    
    
    handleChange = (event, { value }) => {
        this.setState({comment: value})
    }
    

    onComment(){
        var {comment} = this.state
        var {meeting_id} = this.props
        this.props.onComment(comment, meeting_id)
        comment = ''
        this.setState({comment:comment})
    }

    render(){
        var {comments} = this.state
        return(
                <Comment.Group size='tiny' >
                    <Header size='small'>
                       <Icon name='comments'/>Comments
                    </Header>
                    {comments.map(comment => {
                        var  time  = comment.time.slice(0, -1).split("T")
                        return (<Comment key={comment.id}>
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>{comment.name}</Comment.Author>
                            <Comment.Metadata>
                            <div>{time[0]} at {time[1]}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.text}</Comment.Text>
                            <Comment.Actions>
                            <Comment.Action >Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                        </Comment>)
                    }
                    )}

                    <Input fluid action={{icon:'send', onClick:this.onComment}} onChange={this.handleChange} placeholder='Write something...' value={this.state.comment}/>
                </Comment.Group>
        );
    }
}
