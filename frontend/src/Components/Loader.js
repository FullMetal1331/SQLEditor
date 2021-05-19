import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = () =>{
	return(
		<div style={{width:'100%', height:'100%', position:'relative'}} >
			<CircularProgress style={{position:'absolute', top:'45%', left:'48%', color:'rgb(81, 83, 255)'}} />
		</div>
	);
}

export default Loader;