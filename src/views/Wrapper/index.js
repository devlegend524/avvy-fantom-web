import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import linkingService from 'services/linking'
import darkmodeSelectors from 'services/darkmode/selectors'
import darkmodeActions from 'services/darkmode/actions'

class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

	toggleMenu = () => {
    this.setState(state => ({
      menuOpen: !state.menuOpen
    }))
  }

  toggleDarkmode = () => {
    this.props.setDarkmode(!this.props.isDarkmode)
  }
 
  render() {
    return (
			<div className='font-poppins'>
				<div className="fixed top-0 bg-white h-full left-0 w-screen z-10 transition-all" style={{left: '100%', transform: this.state.menuOpen ? 'translateX(-100%)' : 'translateX(0)'}}>
					<div className="absolute top-0 right-0 p-4 cursor-pointer" onClick={this.toggleMenu.bind(this)}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<div className="font-poppins flex-col flex justify-center items-center h-full p-4">
						<a className="block text-center" href="#">
							<img src="/images/logo.png" className="w-16 m-auto mb-4" />
						</a>
            <Link 
              className='block text-center text-lg p-2' 
              to={linkingService.path('SunriseAuction')}
              onClick={this.toggleMenu.bind(this)}>
              Sunrise Auction
            </Link>
            <Link 
              className='block text-center text-lg p-2' 
              to={linkingService.path('MyDomains')}
              onClick={this.toggleMenu.bind(this)}>
              My Domains
            </Link>
						<div className="h-24"></div>
					</div>
					<div className="absolute bottom-0 mb-8 text-center w-full">
						<div className="w-32 m-auto">
							<a href="https://avax.network">
								<img src="/images/avax.png" />
							</a>
						</div>
					</div>
				</div>
				<div className="fixed top-0 w-full h-16 md:h-24 border-b-2 border-gray-100 bg-white">
					<div className="text-center flex items-center justify-between w-full h-full max-w-screen-xl m-auto">
						<Link to={linkingService.path('Landing')}>
							<div className="h-full ml-1 md:ml-3 items-center justify-center flex">
								<div>
									<img src="/images/logo.png" className="w-12 md:w-20 m-auto" />
								</div>
								<div className="text-left ml-1 md:ml-3">
									<div className="font-zen uppercase text-md md:text-xl">Avvy</div>
									<div className="font-poppins text-xs md:text-sm" style={{marginTop: '-4px'}}>The Avalanche Name Service</div>
								</div>
							</div>
						</Link>
						<div className="p-3 md:hidden cursor-pointer" onClick={this.toggleMenu.bind(this)}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
							</svg>
						</div>
						<div className="pr-8 hidden md:flex">
							<div className="font-poppins ml-8 text-md">
								<Link to={linkingService.path('SunriseAuction')}>Sunrise Auction</Link>
							</div>
							<div className="font-poppins ml-8 text-md">
        				<Link to={linkingService.path('MyDomains')}>My Domains</Link>
							</div>
						</div>
					</div>
				</div>
        <div className="h-16 md:h-24"></div>
        <div className='max-w-screen-md m-auto p-4'>
          {this.props.children}
        </div>
			</div>
    )
  }
}

const mapStateToProps = (state) => ({
  isDarkmode: darkmodeSelectors.isDarkmode(state),
})

const mapDispatchToProps = (dispatch) => ({
  setDarkmode: (value) => dispatch(darkmodeActions.setDarkmode(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
