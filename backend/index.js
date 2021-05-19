const express = require('express');
const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.get('/', (req, res)=>{
	res.send('sdfsdf');
})

app.get('/getTableFields/:table', (req, res)=>{
	const tempMap = {
		'customers':['customerId','customerName','age','address','rating'],
		'products':['productId','productName','price','company'],
		'interns':['internId','internName','location','remoteWork','division'],
	}
	
	console.log(req.params);
	console.log(tempMap);
	
	res.send(tempMap[req.params.table]);
});

app.get('/getQueryResponse/:query', (req, res)=>{
	
	const tempMap = {
		'customers':[
			{
				customerId:1,
				customerName:'James Butterburg',
				age:23,
				address:'New Orleans',
				rating:'7',
			},
			{
				customerId:2,
				customerName:'Jenny Jefferson',
				age:22,
				address:'California',
				rating:'5',
			},
			{
				customerId:3,
				customerName:'Jonh Doe',
				age:35,
				address:'Florida',
				rating:'8',
			},
			{
				customerId:4,
				customerName:'Levi Ackerman',
				age:24,
				address:'New York',
				rating:'9',
			},
			{
				customerId:5,
				customerName:'Edward Elric',
				age:27,
				address:'Boston',
				rating:'9',
			},
			{
				customerId:6,
				customerName:'Spike Spigel',
				age:34,
				address:'Ohio',
				rating:'8',
			},
		],
		'products':[
			{
				productId:1,
				productName:'Post It',
				price:50,
				company:'Natraj',
			},
			{
				productId:2,
				productName:'Triangle Pencil',
				price:15,
				company:'Apsara',
			},
			{
				productId:3,
				productName:'Non-Dust Eraser',
				price:30,
				company:'Apsara',
			},
			{
				productId:4,
				productName:'Protractor',
				price:90,
				company:'Camlin',
			},
			{
				productId:5,
				productName:'Compass',
				price:150,
				company:'Camlin',
			},
			{
				productId:6,
				productName:'Pencil Box',
				price:200,
				company:'Natraj',
			},
		],
		'interns':[
			{
				internId:1,
				internName:'Izumi Kurtis',
				location:'Colorado',
				remoteWork:'Yes',
				division:'R&D',
			},
			{
				internId:2,
				internName:'Alphonse Elric',
				location:'Manhattan',
				remoteWork:'Yes',
				division:'Backend',
			},
			{
				internId:3,
				internName:'Winry Rockfella',
				location:'Belgium',
				remoteWork:'No',
				division:'DevOps',
			},
			{
				internId:4,
				internName:'Mira Oliver',
				location:'Reykjavík',
				remoteWork:'Yes',
				division:'Marketing',
			},
			{
				internId:5,
				internName:'Roy Mustang',
				location:'Beirut',
				remoteWork:'Yes',
				division:'FrontEnd',
			},
			{
				internId:6,
				internName:'Riza Hawkeye',
				location:'Beirut',
				remoteWork:'Yes',
				division:'FrontEnd',
			},
		],
	}
	
	const query = req.params.query.substring(0,req.params.query.length-1);
	//Seperating all parts of the query
	let tempQueryArr = query.split(" ");
	console.log(tempQueryArr[3]);
	console.log(tempMap.customers);
	//Seperating all the selected fields
	let tempFieldArr = tempQueryArr[1].split(",");
	let tempFieldMap = {};
	tempFieldArr.map((ele)=>{
		tempFieldMap.ele = true;
	})
	
	let finalData = [];
	
	//forming final data
	if(tempQueryArr[0]==='SELECT'){
		tempMap[tempQueryArr[3]].map((ele,ind)=>{
			if(tempFieldArr[0]==='*'){
				finalData.push(ele);
			}
			else{
				let tempObj = {};
				tempFieldArr.map((ele2,ind2)=>{
					tempObj[ele2] = ele[ele2];
				})
				finalData.push(tempObj);
			}
		})
	}
	
	res.send(finalData);
});

app.listen(5000, ()=>console.log('Listening to port 5000...'));