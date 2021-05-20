//Imports
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

import Loader from '../Components/Loader';
import SnackBar from '../Components/SnackBar';
import {apiurl} from '../config.js';

import {useStyles} from '../Styles/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { 
	Button,
	Divider,
	FormControl, 
	FormControlLabel,
	FormHelperText,
	FormLabel, 
	InputLabel,
	Paper, 
	Radio, 
	RadioGroup,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import './QueryPage.css';

const mainTheme = createMuiTheme({
	palette:{
		primary:{
			main:`rgb(0,0,0)`,
		},
		secondary:{
			main:'rgb(81, 83, 255)',
		},
	},
  overrides:{
  	MuiFormControl:{
  		root:{
  			marginLeft:'5%',
  		},
  	},
  	MuiDivider:{
  		root:{
  			marginLeft:'5%',
  			width:'90%',
  		},
  	},
  	MuiButton:{
  		label:{
  			textTransform:'none',
  			fontSize:'calc(5px + 0.7vw)',
  			flexWrap:'nowrap',
  		},
  	},
  }
});

// const tables =[
// 	'customers',
// 	'products',
// 	'interns',
// ]

//Final Function
const QueryPage = (props) => {
	//Style Classes
	const classes = useStyles();
	
	//References
	const conditionField2Input = useRef();
	
	//Variables
	const [tables, setTables] = useState([]);
	
	const [loader, setLoader] = useState(false);
	const [snackBar, setSnackBar] = useState(false);
	const [snackBarMsg, setSnackBarMsg] = useState('');
	
	const [opt1, setOpt1] = useState('');
	const [opt2, setOpt2] = useState('');
	const [opt4_1, setOpt4_1] = useState('');
	const [opt4_2, setOpt4_2] = useState('');
	// const [opt4_3, setOpt4_3] = useState('');
	
	const [fieldsReceived, setFieldsReceived] = useState(false);
	const [allFields, setAllFields] = useState([]);
	const [availableFields, setAvailableFields] = useState([]);
	const [selectedFields, setSelectedFields] = useState([]);
	
	const [initialQuery, setInitialQuery] = useState({
		conjunction1:'FROM',
		conjunction2:'WHERE',
		table:'',
		operation:'',
		conditions:{},
		fields:[],
	});
	const [finalQuery, setFinalQuery] = useState('');
	
	const [receivedFinalResult, setReceivedFinalResult] = useState(false);
	const [finalResult, setFinalResult] = useState([]);
	
	//Functions
	const resetSettings = () => {
		setOpt1('');
		setOpt2('');
		setOpt4_1('');
		setOpt4_2('');
		setAvailableFields([...availableFields,...selectedFields]);
		setSelectedFields([]);
		setReceivedFinalResult(false);
		setFinalResult([]);
	}
	
	const changeOption1 = (event) => {
		setOpt1(event.target.value);
	};
	
	const changeOption2 = (event) => {
		setOpt2(event.target.value);
	};
	
	const changeOption4_1 = (event) => {
		setOpt4_1(event.target.value);
	}
	
	const changeOption4_2 = (event) => {
		setOpt4_2(event.target.value);
	}
	
	// const changeOption4_3 = (value) => {
	// 	setOpt4_3(value);
	// }
	
	const closeSnackBar = (event, reason) => {
		if (reason === 'clickaway') {
	      return;
	    }
	    setSnackBarMsg('');
    	setSnackBar(false);
	}
	
	function handleOnDragEnd(result) {
		if (!result.destination) return;
		
		console.log(result);
		
		if(result.destination.droppableId==='availableFields'){
			
			if(result.source.droppableId==='availableFields'){
				let items = Array.from(availableFields);
				
				const [reorderedItem] = items.splice(result.source.index, 1);
				items.splice(result.destination.index, 0, reorderedItem);
				
				setAvailableFields(items);
			}
			else{
				let sourceItems = Array.from(selectedFields), destinationItems = Array.from(availableFields);
				const [reorderedItem] = sourceItems.splice(result.source.index, 1);
				
				destinationItems.splice(result.destination.index, 0, reorderedItem);
				
				setSelectedFields(sourceItems);
				setAvailableFields(destinationItems);
			}
			
		}
		else{
			
			if(result.source.droppableId==='selectedFields'){
				let items = Array.from(selectedFields);
				
				const [reorderedItem] = items.splice(result.source.index, 1);
				items.splice(result.destination.index, 0, reorderedItem);
				
				setSelectedFields(items);
			}
			else{
				let sourceItems = Array.from(availableFields), destinationItems = Array.from(selectedFields);
				const [reorderedItem] = sourceItems.splice(result.source.index, 1);
				
				destinationItems.splice(result.destination.index, 0, reorderedItem);
				
				setAvailableFields(sourceItems);
				setSelectedFields(destinationItems);
			}
		}
		
		// const items = Array.from(characters);
		// const [reorderedItem] = items.splice(result.source.index, 1);
		// items.splice(result.destination.index, 0, reorderedItem);

		// updateCharacters(items);
	};
	
	function addCondition(){
		setInitialQuery({...initialQuery,conditions:{field1:opt4_1,operation:opt4_2,field2:conditionField2Input.current.value}});
	}
	
	function removeCondition(){
		setInitialQuery({...initialQuery,conditions:{}});
	}
	
	function checkGeneratedQuery(){
		if(initialQuery.table!=='' &&
			initialQuery.operation!=='' &&
			initialQuery.fields.length!==0 &&
			(
				(Object.keys(initialQuery.conditions).length===0) ||
				(initialQuery.conditions.field1!=='' && initialQuery.conditions.operation!=='' && initialQuery.conditions.field2!=='')
			)
		){
			setReceivedFinalResult(false);
			setLoader(true);
			axios
			.get(`${apiurl}/getQueryResponse/${finalQuery}`)
			.then((res)=>{
				console.log(res);
				setFinalResult(res.data);
				setLoader(false);
				setReceivedFinalResult(true);
			})
			.catch((err)=>{
				setSnackBarMsg('Failed to contact server. Please try again');
				setSnackBar(true);
			})
		}
		else{
			setSnackBarMsg('Please Generate a valid query');
			setSnackBar(true);
		}
	};
	
	//useEffect Hooks
	
	//get Table list
	useEffect(()=>{
		axios
		.get(`${apiurl}/getTables`)
		.then((res)=>{
			setTables(res.data);
		})
		.catch((err)=>{
			setSnackBarMsg('Failed to retireve data. Please refresh the page');
			setSnackBar(true);
		})
	},[])
	
	//updating initialQuery and fetching fields on table change
	useEffect(()=>{
		setInitialQuery({...initialQuery,table:`${opt1}`});
		
		setFinalResult([]);
		
		if(opt1!==''){
			
			setFieldsReceived(false);
			
			axios
			.get(`${apiurl}/getTableFields/${opt1}`)
			.then((res)=>{
				var tempArr = [];
				res.data.map((ele,ind)=>{
					tempArr.push({
						id:ele,
						name:ele,
						thumb:'',
					});
				});
				setAllFields(tempArr);
				setAvailableFields(tempArr);
				setSelectedFields([]);
				setFieldsReceived(true);
			})
			.catch((err)=>{
				setSnackBarMsg('Failed to retrieve table fields. Please refresh the page');
				setSnackBar(true);
			})
		}
		else{
			resetSettings();
		}
	},[opt1])
	
	//updating initialQuery on query function change
	useEffect(()=>{
		setInitialQuery({...initialQuery,operation:`${opt2}`});
	},[opt2])
	
	//updating initialQuery on field changes
	useEffect(()=>{
		if(availableFields.length===0)
			setInitialQuery({...initialQuery,fields:[{id:'*'}]});
		else
			setInitialQuery({...initialQuery,fields:[...selectedFields]});
	},[selectedFields])
	
	//updating finalQuery on initialQuery change
	useEffect(()=>{
		console.log(initialQuery);
		
		let tmpString = '';
		
		tmpString += `${initialQuery.operation}`;
		
		if(initialQuery.operation!=='SELECT'){
			tmpString += ' FROM';
		}
		else{
			initialQuery.fields.map((ele,ind)=>{
				if(ind>0)
					tmpString += `,${ele.id}`;
				else
					tmpString += ` ${ele.id}`;
			})
			tmpString += ' FROM';
		}
		
		tmpString += ` ${initialQuery.table}`;
		
		console.log(Object.keys(initialQuery.conditions).length!==0);
		
		if(Object.keys(initialQuery.conditions).length!==0){
			tmpString += ' WHERE';
			tmpString += ` ${initialQuery.conditions.field1}`;
			tmpString += ` ${initialQuery.conditions.operation}`;
			tmpString += ` ${initialQuery.conditions.field2}`;
		}
		
		tmpString += ';';
		
		setFinalQuery(tmpString);
	},[initialQuery])
	
	return (
		<div style={{height:'100%',width:'100%'}} >
			{/*Alerts start*/}
			<SnackBar open={snackBar} message={snackBarMsg} closeSnackBar={closeSnackBar} />
			{/*Alerts end*/}
			
			<div className={classes.root}>
				<ThemeProvider theme={mainTheme}>
				{/*Query Generator Section*/}
					<div className={classes.queryOptions}>
						<h3>Query Generator</h3>
						<Paper 
							elevation={1}
							className={classes.queryOptionsPaper}
						>
						{/*Selecting Table*/}
							<div className='Query-Generator-Option Option1'>
								<h3>
									Select Table:
								</h3>
								<FormControl variant="outlined" className={classes.formControl}>
							        <InputLabel htmlFor="outlined-age-native-simple">Table</InputLabel>
							        <Select
							          native
							          value={opt1}
							          onChange={changeOption1}
							          label="Table"
							          inputProps={{
							            name: 'table',
							            id: 'outlined-table',
							          }}
							        >
							        	<option key={0} aria-label="None" value="" />
							          {
				  			          tables.map((ele,ind)=>{
				  			          	return <option key={ind+1} value={ele}>{ele}</option>
				  			          })
							          }
							        </Select>
							    </FormControl>
							</div>
							<Divider />
						{/*Selecting Function*/}
							{
								(opt1!=='') &&
								<div className='Query-Generator-Option Option2'>
									<h3>
										Select Query Function:
									</h3>
									<FormControl component="fieldset" >
										<RadioGroup aria-label="gender" name="gender1" value={opt2} onChange={changeOption2} row >
											<FormControlLabel value="SELECT" control={<Radio color='secondary' />} label="Retrieve Information" />
											{/*<FormControlLabel value="DELETE" control={<Radio />} label="Delete Information" />*/}
										</RadioGroup>
									</FormControl>
								</div>
							}
							<Divider />
						{/*Selecting Fields*/}
							{
								(opt1!=='' && opt2==='SELECT') &&
								<div className='Query-Generator-Option Option3' >
									<h3>
										Select Fields:
									</h3>
									<DragDropContext onDragEnd={handleOnDragEnd}>
									
										{/*Available Fields Droppable List*/}
										<div className="Query-Generator-Option-List-Container">
											<h3>Available Fields</h3>
											<Droppable droppableId="availableFields">
												{(provided) => (
													<ul className="Query-Generator-Option-List" style={{border:'1px solid black'}} {...provided.droppableProps} ref={provided.innerRef}>
														{
															(fieldsReceived)?
																availableFields.map(({id, name, thumb}, index) => {
																	return (
																		<Draggable key={id} draggableId={id} index={index}>
																			{(provided) => (
																				<li className="Fields-List-Tile" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																					<p style={{fontSize:'20px'}} >
																						{ name }
																					</p>
																				</li>
																			)}
																		</Draggable>
																	);
																})
															:
																<Loader />
														}
														{provided.placeholder}
													</ul>
												)}
											</Droppable>
										</div>
										
										{/*Selected Fields Droppable List*/}
										<div className="Query-Generator-Option-List-Container">
											<h3>Selected Fields</h3>
											<Droppable droppableId="selectedFields">
												{(provided) => (
													<ul className="Query-Generator-Option-List" style={{border:'1px solid black'}} {...provided.droppableProps} ref={provided.innerRef}>
														{
															(fieldsReceived)?
																selectedFields.map(({id, name, thumb}, index) => {
																	return (
																		<Draggable key={id} draggableId={id} index={index}>
																			{(provided) => (
																				<li className="Fields-List-Tile" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																					<p style={{fontSize:'20px'}} >
																						{ name }
																					</p>
																				</li>
																			)}
																		</Draggable>
																	);
																})
															:
																<Loader />
														}
														{provided.placeholder}
													</ul>
												)}
											</Droppable>
										</div>
										
									</DragDropContext>
									<div className='Query-Generator-Fields-Button' >
										<Button
											variant="contained"
											color='secondary'
											onClick={()=>{setSelectedFields([...selectedFields,...availableFields]);setAvailableFields([]);}}
										>
											Select All
										</Button>
										<span style={{height:'10%'}} ></span>
										<Button
											variant="contained"
											color='secondary'
											onClick={()=>{setAvailableFields([...selectedFields,...availableFields]);setSelectedFields([]);setInitialQuery({...initialQuery,conditions:{}})}}
										>
											Reset
										</Button>
									</div>
								</div>
							}
							<Divider />
						{/*Selecting Condition*/}
							{
								(opt1!=='' && opt2!=='' && selectedFields.length>0) &&
								<div className='Query-Generator-Option Option4' >
									<h3>Select Condition:</h3>
									<div className="Option4-Condition-Fields" >
										<FormControl variant="outlined" className={classes.formControl}>
									        <InputLabel htmlFor="outlined-condition-field-native-simple">Field1</InputLabel>
									        <Select
									          native
									          value={opt4_1}
									          onChange={changeOption4_1}
									          label="Field1"
									          inputProps={{
									            name: 'field1',
									            id: 'outlined-field1'
									          }}
									        >
									        	<option key={0} aria-label="None" value="" />
									          {
						  			          allFields.map((ele,ind)=>{
						  			          	return <option key={ind+1} value={ele.id}>{ele.name}</option>
						  			          })
									          }
									        </Select>
									    </FormControl>
									    <FormControl variant="outlined" className={classes.formControl}>
									        <InputLabel htmlFor="outlined-condition-field-native-simple">Operation</InputLabel>
									        <Select
									          native
									          value={opt4_2}
									          onChange={changeOption4_2}
									          label="Operation"
									          inputProps={{
									            name: 'operation',
									            id: 'outlined-operation'
									          }}
									        >
									        	<option key={0} aria-label="None" value="" />
									        	<option key={1} value={'>'}>{'Greater than'}</option>
									        	<option key={2} value={'>='}>{'Greater than Equal to'}</option>
									        	<option key={3} value={'='}>{'Equal to'}</option>
									        	<option key={4} value={'!='}>{'Not Equal to'}</option>
									        	<option key={5} value={'<='}>{'Less than Equal to'}</option>
									        	<option key={6} value={'<'}>{'Less than'}</option>
									        </Select>
									    </FormControl>
									    <FormControl variant="outlined" className={classes.formControl}>
									        {/*<InputLabel htmlFor="outlined-condition-field-native-simple">Field2</InputLabel>*/}
									        <Autocomplete
									        	freeSolo
									        	disableClearable
									        	autoComplete
										        id="free-solo-2-demo"
										        options={allFields.map((ele) => ele.id)}
										        renderInput={(params) => (
										          <TextField
										            {...params}
										            label="Field2"
										            variant="outlined"
										            InputProps={{ ...params.InputProps, type: 'search' }}
										            style={{margin:'0'}}
										            inputRef={conditionField2Input}
										          />
										        )}
										     />
									        {/*<Select
									          native
									          value={opt4_3}
									          onChange={changeOption4_3}
									          label="Field2"
									          inputProps={{
									            name: 'field2',
									            id: 'outlined-field2'
									          }}
									        >
									        	<option key={0} aria-label="None" value="" />
									          {
						  			          allFields.map((ele,ind)=>{
						  			          	return <option key={ind+1} value={ele.id}>{ele.name}</option>
						  			          })
									          }
									        </Select>*/}
									    </FormControl>
									</div>
									<div className='Query-Generator-Fields-Button'>
										<Button
											variant="contained"
											color='secondary'
											onClick={()=>{addCondition();}}
										>
											Add
										</Button>
										<span style={{height:'10%'}} ></span>
										<Button
											variant="contained"
											color='secondary'
											onClick={()=>{removeCondition();}}
										>
											Remove
										</Button>
									</div>
								</div>
							}
						</Paper>
					</div>
				{/*Generated Query Section*/}
					<div className={classes.queryTextEditor}>
						<h3>Generated Query</h3>
						
						<TextField
							className={classes.queryTextEditorInput}
							style={{marginLeft:'0'}}
							variant={'outlined'}
							multiline={true}
							value={finalQuery}
							rows={7}
							rowsMax={10}
							inputProps={{
								readOnly:true
							}}
						/>
						
						<Button
							variant="contained"
							color='secondary'
							onClick={()=>{checkGeneratedQuery();}}
							className={classes.button}
							style={{margin:'5% 10% 0 0'}}
						>
							Fetch Query
						</Button>
					</div>
				</ThemeProvider>
			</div>
		{/*Result Section*/}
			<div className={classes.rootResult}>
				<div className={classes.result}>
					<h3>Results</h3>
					<Paper 
						elevation={1}
						className={classes.resultPaper}
					>
					{
						(loader) && <Loader/>
					}
					{
						(receivedFinalResult) && 
						<TableContainer style={{width:'100%', height:'100%'}} component={Paper}>
					      <Table className={classes.table} aria-label="simple table">
					        <TableHead>
					          <TableRow>
					          	{
					          		selectedFields.map((ele,ind) => {
					          			return (<TableCell align='left' style={{color:'rgb(81, 83, 255)', fontSize:'20px', fontWeight:'600'}} >{ele.name}</TableCell>)
					          		})
					          	}
					          </TableRow>
					        </TableHead>
					        <TableBody>
					          {
					          	finalResult.map((row,ind) => {
						          	return(
						          		<TableRow key={ind}>
						          			{
						          				selectedFields.map((ele) => {
						          					return (<TableCell align="left">{row[ele.id]}</TableCell>);
						          				})
						          			}
							            </TableRow>
						          	);
						          })
					          }
					        </TableBody>
					      </Table>
					    </TableContainer>
					}
					</Paper>
				</div>
			</div>
		</div>
	)
}

export default QueryPage;