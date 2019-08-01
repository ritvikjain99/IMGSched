import React, { Component } from 'react'
import { Button, Confirm } from 'semantic-ui-react'

export default class ConfirmExampleConfirm extends Component {
  state = { open: false }

  open = (event) => {
    event.stopPropagation();
    this.setState({ open: true })
    }
  close = (event) => {
    event.stopPropagation();
    this.setState({ open: false })
    }
  delete = (event) => {
    var { id, onClick } = this.props
    this.close()
    onClick(event, id)
  }

  render() {
    const content = "This event would be deleted permanently, proceed ?"
    return (
      <div>
        <Button circular icon='delete' size='tiny' onClick={this.open} negative/>
        <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.delete} content={content}/>
      </div>
    )
  }
}