const express = require('express')
const mysql  = require('mysql')
const myconn = require('express-myconnection')
var cors = require('cors')

const routes = require('./routes')




const app = express()
app.set('port', process.env.PORT || 5453)


const dbOptions = {
    host: 'bf9spvhvonnsjsclcvhx-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'usalutm999s3o9fh',
    password: 'WbUTHs3GsHGCa5ypSNpM',
    database: 'bf9spvhvonnsjsclcvhx'
}
var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
     preflightContinue: false,
    optionsSuccessStatus: 204
  }
app.use(cors(corsOptions))
 
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())

//rutas
app.get('/', (req, res)=>{
    res.send('Welcome')
})

app.use('/seguimiento', routes)
app.use('/login', routes)

app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})