import React, { Component } from 'react'
import Service from '../Services';
import { Feed, Accordion, Tab, Item, Button } from 'semantic-ui-react';
import FeedComment from './meetingComment';
import RefreshedToken from './RefreshToken';
import ConfirmDeleteButton from './ConfirmDeleteButton';
import GoogleCalender from './GoogleCalender';
import Axios from 'axios';

const service = new Service();

export default class MeetingList extends Component {
    constructor(props){
        super(props)
        this.state = {
            meetings: [],
            comments: {},
            socket: {},
            activeIndex: -1,
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.UpdateMeetings = this.UpdateMeetings.bind(this);
        this.UpdateComments = this.UpdateComments.bind(this);
    }

    componentWillMount(){
        this.UpdateMeetings();
        this.UpdateComments();

        var socket = new WebSocket( "ws://localhost:8000/ws/comment/")
        socket.onmessage = (event) => { 
            var comment = JSON.parse(event.data).comment
            var { comments } = this.state
            if(comments[comment.meeting] === undefined)
                comments[comment.meeting] = []
            comments[comment.meeting].push(comment)
            this.setState({comments: comments})
        }
        socket.onopen = (event) => {console.log('connected')}
        socket.onclose = (event) => {console.log('closing')}
        socket.onerror = (event) => {console.log('error')}
        this.setState({socket: socket})
    }

    
    currentTime(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        return date+"T"+time
    }


    UpdateMeetings(){
        var {user} = this.props
        RefreshedToken(user.refresh).then(access => {
            service.getMeetings(access)
            .then((response) => {
                this.setState({ meetings: response})
            })
            .catch(error => {console.log(error)})
        })
        .catch(error => console.log(error))
        
    };


    UpdateComments(){
        Axios.get(`http://localhost:8000/api/comments/`)
        .then(response => {
            var comments = {}
            response.data.map(comment => {
                if(comments[comment.meeting] === undefined)
                    comments[comment.meeting] = []
                comments[comment.meeting].push(comment)
                return comment
            })
            this.setState({comments: comments})
        })
        .catch(error => {
            console.log(error)
        })
    };


    handleClick(e, titleProps){
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex }) 
    }
    
    
    handleComment(text, meeting_id){
        var comment = {
            'text': text,
            'author': this.props.user.id,
            'meeting': meeting_id,
            'time': this.currentTime()
        }
        this.registerComment(comment)
        .then(data => {
            var { socket } = this.state
            socket.send(JSON.stringify(data))
        })
    }

    handleDelete(event, id){
        event.stopPropagation()
        console.log(event)
        var {user} = this.props
        RefreshedToken(user.refresh)
        .then(access => {
            service.deleteMeeting(id, access)
            .then(response => {
                var {meetings, comments} = this.state
                meetings = meetings.filter(meeting => {
                    if(meeting.meeting_id === id)
                        comments[id] = []
                    return meeting.meeting_id !== id   
                })
                this.setState({meetings: meetings, comments: comments})
            })
        })
        .catch(error => {console.log(error.response.data)})
    }
    

    registerComment(comment){
        return Axios.post("http://localhost:8000/api/comments/", comment)
        .then(response => response.data)
        .catch(error => {
            console.log(error)
        })
    }


    render() {
    var { user } = this.props
    var { meetings, activeIndex, comments } = this.state
    var meetingFeed = (meeting) =>   <Feed>
                                        <Feed.Event>
                                        <Feed.Label image={'https://react.semantic-ui.com/images/avatar/small/matt.jpg'}  />
                                        <Feed.Content date={meeting.meeting_time} summary={`Admin : ${meeting.name}  |  Description : ${meeting.meeting_description}`} />
                                        <Button.Group>
                                            <GoogleCalender meeting={meeting} />
                                            <ConfirmDeleteButton onClick={this.handleDelete} id={meeting.meeting_id}/>
                                        </Button.Group> 
                                        </Feed.Event>
                                     </Feed>
                                     
    var AccordionItem = (meeting) => {
                                    var { meeting_id } = meeting
                                    if(comments[meeting_id] === undefined)
                                        comments[meeting_id] = []
                                    return (<Item key={meeting_id}>
                                        <Accordion.Title active={activeIndex === meeting_id} index={meeting_id} onClick={this.handleClick}>
                                            {meetingFeed(meeting)}
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === meeting_id}>
                                            <FeedComment comments={comments[meeting_id]} onComment={this.handleComment} meeting_id={meeting_id}/>
                                        </Accordion.Content>
                                    </Item>)
                                    }

    var panes = [
        { menuItem:  'Private Meetings', 
        render: () => <Tab.Pane>
                        <Accordion fluid styled>
                            {meetings
                            .filter(meeting => (meeting.isPrivate && meeting.invited.includes(user.id))|| meeting.admin === user.id)
                            .map(meeting => AccordionItem(meeting))}
                        </Accordion>
                      </Tab.Pane> },
        
        { menuItem:  'Public Meetings', 
        render: () => <Tab.Pane>
                        <Accordion fluid styled>
                            {meetings
                            .filter(meeting => !meeting.isPrivate)
                            .map(meeting => AccordionItem(meeting))}
                        </Accordion>
                      </Tab.Pane> }
    ]
        
    return(
         <Tab size='large' panes={panes} menu={{ fluid: true, vertical: true}}/>
    );
    }
}
