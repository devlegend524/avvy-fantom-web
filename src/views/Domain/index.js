import React from 'react'
import { connect } from 'react-redux'

import linkingService from 'services/linking'


class Domain extends React.PureComponent {
  constructor(props) {
    super(props)
    const params = linkingService.getParams('Domain')
    this.state = {
      domain: params.domain,
    }
  }

  updateParams = () => {
    const params = linkingService.getParams('Domain')
    this.setState({
      domain: params.domain
    })
  }

  componentDidMount() {
    linkingService.addEventListener('Domain', this.updateParams)
  }

  componentWillUnmount() {
    linkingService.removeEventListener('Domain', this.updateParams)
  }

  render() {
    return (
      <div>Domain {this.state.domain}</div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Domain)
