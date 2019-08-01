import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { Button } from 'semantic-ui-react';
  
  export default class CalenderButton extends React.Component {
      constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this); 
      }
      
      handleItemClick(e){
        e.stopPropagation();
        var { meeting } = this.props;
        var { meeting_description, meeting_time, name, isPrivate } = meeting;
        var meeting_type = isPrivate ? "private":"public";
        var calendarId = JSON.parse(localStorage.getItem("user")).email;
        var event = {
          "start": {
            "dateTime": (new Date()).toISOString(),
          },
          "end": {
            "dateTime": meeting_time,
          },
          "description": meeting_description,
          "summary": `${name} created a ${meeting_type} meeting.`,
          "organizer": name,
          "kind": "calendar#event",
        }
        ApiCalendar.createEvent(event, calendarId)
        .then(response => {console.log(response)})
        .catch(error => {console.log(error)});
        
        console.log(meeting,event);
      }

      render(){
        return (
            <Button onClick={this.handleItemClick}/>
          );
      }
  }