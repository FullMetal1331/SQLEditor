import { makeStyles } from '@material-ui/core/styles';

//Styles
const useStyles = makeStyles((theme) => ({
  root: {
    height:'80%',
    
    display: 'flex',
    justifyContent:'flex-start',
    flexWrap: 'wrap',
    
    paddingTop:'2%',
    paddingLeft:'2%',
    
    backgroundColor:'rgb(229, 231, 249)',
  },
  
  queryOptions:{
    height:'95%',
    width:'65%',
    
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
  },
  
  queryOptionsPaper:{
    height:'90%',
    width:'100%',
    
    overflowY:'auto',
    
    display:'flex',
    flexDirection:'column',
    
    backgroundColor:'white',
  },
  
  queryTextEditor:{
    height:'55%',
    width:'30%',
    
    marginLeft:'5%',
    
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
  },
  
  queryTextEditorPaper:{
    height:'90%',
    width:'100%',
    
    display:'flex',
    flexDirection:'column',
    
    backgroundColor:'white',
  },
  
  queryTextEditorInput:{
    width:'90%',
    
    borderRadius:'5px',
    boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    backgroundColor:'white',
  },
  
  formControl: {
    marginLeft:'5%',
    minWidth: 120,
  },
  
  button:{
    alignSelf:'flex-end',
  },
  
  rootResult: {
    height:'50%',
    
    display: 'flex',
    justifyContent:'flex-start',
    flexWrap: 'wrap',
    
    paddingLeft:'2%',
    
    backgroundColor:'rgb(229, 231, 249)',
  },
  
  result:{
    height:'90%',
    width:'95%',
    
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
  },
  
  resultPaper:{
    height:'90%',
    width:'100%',
    
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    
    backgroundColor:'white',
  },
  
  table: {
    color:'black',
  },
  
}));

export {useStyles};