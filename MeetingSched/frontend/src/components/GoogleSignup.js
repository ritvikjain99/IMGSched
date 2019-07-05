import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import Service from '../Services';

const service = new Service();

export default class GoogleSignup extends Component {
    constructor(props){
        super(props)
        this.onFailure = this.onFailure.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
    }

    onFailure = (response) => {
      this.props.failure()
    }

    onSuccess = (response) => {
      console.table(response.profileObj)
      var {givenName, familyName, email, googleId} = response.profileObj;
      var data = {};
      data['username'] = givenName
      data['first_name'] = givenName
      data['last_name'] = familyName
      data['password'] = googleId
      data['email'] = email
      data['is_staff'] = 'false'
      service.createUser(data)
      .then(response => {
        this.props.success()
        console.table(response)
      })
      .catch(error => {
        this.props.failure(error)
        console.table(response)
      })
    }

    render(){
      return(
        <GoogleLogin
        clientId="723797070419-c8fp9n8bt14segt706adkjv5u1mr8ae0.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
        buttonText={this.props.content}
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
      />);
      
    }
}   