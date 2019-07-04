import React, { Component } from 'react'
import Service from '../Services';
import { Feed, Accordion, Tab, Item, Container, Button } from 'semantic-ui-react';
import FeedComment from './meetingComment';
import RefreshedToken from './RefreshToken';

const service = new Service();

export default class MeetingList extends Component {
    constructor(props){
        super(props)
        this.state = {
            meetings: [],
            activeIndex: -1,
        }
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount(){
        this.UpdateMeetings();
    }
    
    UpdateMeetings(){
        var {user} = this.props
        var self = this
        RefreshedToken(user.refresh).then(response => {

            service.getMeetings(response.data.access)
            .then((response) => {
                // console.log(response)
                self.setState({meetings: response,}) 
            })
            .catch(error => {console.log(error)})

        })
        .catch(error => console.log(error))
        
    };


    handleClick(e, titleProps){
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        console.log(titleProps)
        this.setState({ activeIndex: newIndex })   
    }
    
    deleteButton(isPublic){
        if(isPublic)
            return <Button icon='delete' label='Delete' floated='right' size='tiny' />
    }

    render() {
    var meetingFeed = (meeting) =>   <Feed size='small'>
                                        <Feed.Event>
                                        <Feed.Label icon={'https://react.semantic-ui.com/images/avatar/small/laura.jpg'} />
                                        <Feed.Content>
                                            <Feed.Date content={meeting.meeting_time} />
                                            <Feed.Summary content={meeting.name.toUpperCase() + " created a meeting."} />
                                            <Feed.Extra content={meeting.meeting_description} />
                                        </Feed.Content>
                                        </Feed.Event>
                                     </Feed>
    var AccordionItem = (meeting) => <Item key={meeting.meeting_id}>
                                        <Accordion.Title active={this.state.activeIndex === meeting.meeting_id} index={meeting.meeting_id} onClick={this.handleClick}>
                                            {meetingFeed(meeting)}
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.activeIndex === meeting.meeting_id}>
                                            <FeedComment meeting_id={meeting.meeting_id}/>
                                        </Accordion.Content>
                                    </Item>

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
