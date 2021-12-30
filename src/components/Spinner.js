//
// loading spinner..
//

function Spinner(props) {
  return (
		<div className={`lds-ring ${props.dark ? 'lds-ring-dark' : ''}`}><div></div><div></div><div></div><div></div></div>
  )
}

export default Spinner
