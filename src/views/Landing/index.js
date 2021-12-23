import React from 'react'
import { connect } from 'react-redux'


class Landing extends React.PureComponent {
  render() {
    return (
      <div>
        Landing
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
