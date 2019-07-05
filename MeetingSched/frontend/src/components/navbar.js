import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'

export default class Navbar extends Component {
  constructor(props){
    super(props);
  }

  
  render() {
    const { activeItem } = this.props
    return (
          <Menu pointing>
            <Menu.Item icon='home' name='home' active={activeItem === 'home'} onClick={this.props.onClick} />
            <Menu.Item icon='plus' name='create' active={activeItem === 'create'} onClick={this.props.onClick} />
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search for meeting...'/>
              </Menu.Item>
              <Menu.Item
                name='logout'
                active={activeItem === 'logout'}
                onClick = {this.props.onClick}
              />
            </Menu.Menu>
          </Menu>
    )
  }
}
