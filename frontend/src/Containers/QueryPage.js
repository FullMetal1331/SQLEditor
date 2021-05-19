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
import './QueryPage.css';

const mainTheme = createMuiTheme({
	palette:{
		primary:{
			main:`rgb(255,255,255)`,
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
  		},
  	},
  }
});

const tables =[
	'customers',
	'products',
	'interns',
]

//Final Function
const QueryPage = (props) => {
	//Style Classes
	const classes = useStyles();
	
	//Variables
	const [loader, setLoader] = useState(false);
	const [snackBar, setSnackBar] = useState(false);
	
	const [opt1, setOpt1] = useState('');
	const [opt2, setOpt2] = useState('');
	
	const [availableFields, setAvailableFields] = useState([]);
	const [selectedFields, setSelectedFields] = useState([]);
	
	const [initialQuery, setInitialQuery] = useState({
		conjunction1:'FROM',
		conjunction2:'WHERE',
		table:'',
		operation:'',
		conditions:[],
		fields:[],
	});
	const [finalQuery, setFinalQuery] = useState('');
	
	const [finalResult, setFinalResult] = useState([]);
	
	//Functions
	const resetSettings = () => {
		setOpt1('');
		setOpt2('');
		setAvailableFields([...availableFields,...selectedFields]);
		setSelectedFields([]);
		setFinalResult([]);
	}
	
	const changeOption1 = (event) => {
		setOpt1(event.target.value);
	};
	
	const changeOption2 = (event) => {
		setOpt2(event.target.value);
	};
	
	const closeSnackBar = (event, reason) => {
		if (reason === 'clickaway') {
	      return;
	    }
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
	
	function checkGeneratedQuery(){
		if(initialQuery.table!=='' && initialQuery.operation!=='' && initialQuery.fields.length!==0){
			setLoader(true);
			axios
			.get(`${apiurl}/getQueryResponse/${finalQuery}`)
			.then((res)=>{
				console.log(res);
				setFinalResult(res.data);
				setLoader(false);
			})
			.catch((err)=>{
				console.log(err);
			})
		}
		else{
			setSnackBar(true);
		}
	};
	
	//useEffect Hooks
	
	//updating initialQuery and fetching fields on table change
	useEffect(()=>{
		setInitialQuery({...initialQuery,table:`${opt1}`});
		
		setFinalResult([]);
		
		if(opt1!==''){
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
				setAvailableFields(tempArr);
				setSelectedFields([]);
			})
			.catch((err)=>{
				console.log(err);
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
		
		tmpString += ` ${initialQuery.table};`;
		
		setFinalQuery(tmpString);
	},[initialQuery])
	
	return (
		<div style={{height:'100%',width:'100%'}} >
			{/*Alerts start*/}
			<SnackBar open={snackBar} closeSnackBar={closeSnackBar} />
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
							<div className='Query-Generator-Option'>
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
								<div className='Query-Generator-Option'>
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
								<div className='Query-Generator-Option' >
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
														{availableFields.map(({id, name, thumb}, index) => {
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
														})}
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
														{selectedFields.map(({id, name, thumb}, index) => {
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
														})}
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
										<Button
											variant="contained"
											color='secondary'
											onClick={()=>{setAvailableFields([...selectedFields,...availableFields]);setSelectedFields([]);}}
										>
											Reset
										</Button>
									</div>
								</div>
							}
							{/*<Divider style={{width:'90%', marginLeft:'5%'}} />
							{
								(opt1!=='' && opt2!=='' && selectedFields.length>0) &&
								<div className='Query-Generator-Option' >
									
								</div>
							}*/}
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
						(finalResult.length>0) && 
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