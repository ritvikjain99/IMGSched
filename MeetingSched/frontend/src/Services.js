import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class Service{

    getMeetings(access) {
        const url = `${API_URL}/api/meetings/`;
        return axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
    getUsers(access) {
        const url = `${API_URL}/api/users/`;
        return axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }   
    getMeetingWithpk(userpk, access) {
        const url = `${API_URL}/api/users/${userpk}/meeting/`;
        return axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
    getUserWithUsername(username, access) {
        const url = `${API_URL}/api/users/${username}/`;
        return axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
    deleteMeeting(meeting_id, access){
        const url = `${API_URL}/api/meetings/${meeting_id}`;
        return axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
    createMeeting(meeting, access){
        var { meeting_description, invited, meeting_time, admin, isPrivate } = meeting
        const url = `${API_URL}/api/meetings/`;
        return axios.post(url, {
            'meeting_description': meeting_description,
            'invited': invited,
            'meeting_time': meeting_time,
            'isPrivate': isPrivate,
            'admin': admin,
            },
            {headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
    createUser(user){
        var { first_name, last_name, username, password, is_staff, email } = user
        const url = `${API_URL}/api/users/`;
        return axios.post(url, {
            'first_name': first_name,
            'last_name': last_name,
            'username': username,
            'email': email,
            'is_staff': is_staff,
            'password': password,
            })
            .then(response => response.data);
    }
    updateMeeting(meeting, access){
        const url = `${API_URL}/api/meetings/${meeting.meeting_id}`;
        return axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + access
            }
        })
        .then(response => response.data);
    }
}