import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import Navbar from './navbar';
import MeetingList from './meetingList';
import MeetingForm from './MeetingForms';
import { Redirect } from 'react-router-dom';



class Timeline extends Component{
  constructor(props){
      super(props)
      this.state = {
          activeItem: 'home',
          user: JSON.parse(localStorage.getItem("user")), // Object User with id and refresh token as field
      }
      this.renderElement = this.renderElement.bind(this);
      this.handleClick = this.handleClick.bind(this);
  }


  renderElement(user){
    if(this.state.activeItem === 'home')
        return <MeetingList user={user} />;
    if(this.state.activeItem === 'logout'){
        localStorage.removeItem("user")
        return <Redirect to='/' />;
    }
    if(this.state.activeItem === 'create')
        return <MeetingForm user={this.state.user} />; 
  }


  handleClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }


  render() {
      return (
        <Grid divided>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Navbar onClick={this.handleClick} activeItem={this.state.activeItem}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                   {this.renderElement(this.state.user)}
                </Grid.Column>
            </Grid.Row>
            
        </Grid>
      );
  }
}

export default Timeline;
