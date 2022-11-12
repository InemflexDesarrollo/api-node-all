const express = require('express')
const mysql  = require('mysql')
const myconn = require('express-myconnection')
var cors = require('cors')
const multer = require('multer')


const routes = require('./routes')





const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads')
    },
    filename: function(req, file, cb){
        console.log(file)
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer(({ storage: storage}))
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
app.use(express.static('./uploads'))

//rutas
//app.get('/upload', (req, res)=>{
//    res.send('aaa')
//})

app.post('/subir', cors(corsOptions), upload.single('file'), (req,res)=>{
    return res.send(req.file.filename)
})
   

app.use('/seguimiento', routes)

app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})