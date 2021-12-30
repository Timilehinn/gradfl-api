const express = require('express');
const app = express();
const PORT = process.env.PORT || 5454
const routes = require('./routes');
const path = require('path')
const cors = require('cors')
const verifyJWT = require('./utils/verifyJWT')

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) 
  };
  
  app.use(
    express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
  );
  app.use(express.json({ limit: "50mb" }));
  
  app.get('/isUserAuth', cors(corsOptions), verifyJWT, (req,res)=>{
    res.json({msg:'you are authorised', authenticated:true})
    console.log('jwt verified')
  })

app.use(cors(corsOptions));

app.use('/v1', routes); 

const publicFiles = express.static(path.join(__dirname, '/images/'));
app.use('/v1/images', publicFiles);

app.get('/', (req,res)=>{
    res.json({ info: 'cryptolead Api Version 1.0.0' })
})

app.listen(PORT, ()=>console.log(`server started at ${PORT} `))
