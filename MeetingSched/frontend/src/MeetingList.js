import React, {Component} from 'react';
import MeetingService from './MeetingService';

const meetingService = new MeetingService();

export default class MeetingList extends Component{

    constructor(props){
        super(props);
        this.state = {
            meeting: [],
        }
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount(){
        var self = this;
        meetingService.getMeeting().then(function(result){
            console.log(result);
            self.setState({meeting: result})
            
        })
        
    }

    handleDelete(e,meeting_id){
        meetingService.deleteMeeting(meeting_id).then(()=>{
            var newArr = this.state.meeting.filter((m)=>{
                return m.meeting_id !== meeting_id;
            })
            this.setState({meeting: newArr});
        })
    }

    render() {

        return (
        <div  className="customers--list">
            <table  className="ui selectable inverted table">
                <thead  key="thead">
                <tr>
                    <th data-label="meeting_id">#</th>
                    <th data-label="username">Username</th>
                    <th data-label="email">Email</th>
                    <th data-label="admin">Admin</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.meeting.map( c  =>
                    <tr  key={c.meeting_id}>
                        <td data-label="meeting_id">{c.meeting_id}  </td>
                        <td data-label="username">{c.username}</td>
                        <td data-label="email">{c.email}</td>
                        <td data-label="admin">{c.admin}</td>
                        <td>
                        <button  onClick={(e)=>  this.handleDelete(e,c.meeting_id) }> Delete</button>
                        <a  href={"/meeting/" + c.meeting_id}> Update</a>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
        );
    }
    
}