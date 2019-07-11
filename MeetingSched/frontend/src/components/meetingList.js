import React, { Component } from 'react'
import Service from '../Services';
import { Feed, Accordion, Tab, Item, Container, Button } from 'semantic-ui-react';
import FeedComment from './meetingComment';
import RefreshedToken from './RefreshToken';
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
        this.UpdateMeetings = this.UpdateMeetings.bind(this);
        this.UpdateComments = this.UpdateComments.bind(this);
    }


    componentDidMount(){
        this.UpdateMeetings();
        this.UpdateComments();

        var socket = new WebSocket( "ws://localhost:8000/ws/comment/")
        socket.onmessage = (event) => { 
            var comment = JSON.parse(event.data).comment
            var { comments } = this.state
            if(comments[comment.meeting] == undefined)
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
        RefreshedToken(user.refresh).then(response => {
            service.getMeetings(response.data.access)
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
                if(comments[comment.meeting] == undefined)
                    comments[comment.meeting] = []
                comments[comment.meeting].push(comment)
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
        console.log("handleComment chala")
    }
    

    registerComment(comment){
        return Axios.post("http://localhost:8000/api/comments/", comment)
        .then(response => response.data)
        .catch(error => {
            console.log(error)
        })
    }


    render() {
    console.log(this.state)
    var meetingFeed = (meeting) =>   <Feed size='small'>
                                        <Feed.Event>
                                        <Feed.Label image={'https://react.semantic-ui.com/images/avatar/small/matt.jpg'} />
                                        <Feed.Content>
                                            <Feed.Date content={meeting.meeting_time} />
                                            <Feed.Summary content={meeting.name.toUpperCase() + " created a meeting."} />
                                            {/* <Feed.Extra content={meeting.meeting_description} /> */}
                                        </Feed.Content>
                                        </Feed.Event>
                                     </Feed>
                                     
    var AccordionItem = (meeting) => {
                                    var { meeting_id } = meeting
                                    var { activeIndex, comments } = this.state
                                    if(comments[meeting_id] == undefined)
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
                            {this.state.meetings
                            .filter(meeting => meeting.isPrivate)
                            .map(meeting => AccordionItem(meeting))}
                        </Accordion>
                      </Tab.Pane> },
        
        { menuItem:  'Public Meetings', 
        render: () => <Tab.Pane>
                        <Accordion fluid styled>
                            {this.state.meetings
                            .filter(meeting => !meeting.isPrivate)
                            .map(meeting => AccordionItem(meeting))}
                        </Accordion>
                      </Tab.Pane> }
    ]
        
    // console.log(panes)
    return(
         <Tab panes={panes} />
    );
    }
}
