import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const SnackBar = (props) => {
	return(
		<Snackbar 
			open={props.open} 
			autoHideDuration={(props.message.length>35)?5000:2000} 
			onClose={props.closeSnackBar}
			anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
		>
			<SnackbarContent
				message={props.message} 
				style={{backgroundColor:'rgb(255, 105, 97)'}}
			/>
	    </Snackbar>
	);
}

export default SnackBar;