const express = require('express')
const mysql  = require('mysql')
const myconn = require('express-myconnection')
var cors = require('cors')
const multer = require('multer')


const routes = require('./routes')





const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    },
    filename: function(req, file, cb){
        console.log(file)
        cb(null, nombre =  `${file.originalname}`)
        //console.log(nombre)
    }
})

const upload = multer(({ storage: storage}))
const app = express()
app.set('port', process.env.PORT || 5454)


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
app.get('/upload/:name', (req, res)=>{
    res.send('./uploads/')
})

app.post('/subir/:id', cors(corsOptions), upload.single('file'), (req,res)=>{
    let name =  res.send(req.file.originalname)
    req.getConnection((err, conn)=> {

        conn.query('UPDATE seguimiento set soporte_ejecucion = ?  where id = ?', [nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
        })
    })
    
})
app.post('/subir_dos/:id', cors(corsOptions), upload.single('file'), (req,res)=>{
    let name =  res.send(req.file.originalname)
    req.getConnection((err, conn)=> {

        conn.query('UPDATE seguimiento set soporte_ejecucion_no_eficaz_uno = ?  where id = ?', [nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
        })
    })
    
})

app.post('/subir_tres/:id', cors(corsOptions), upload.single('file'), (req,res)=>{
    let name =  res.send(req.file.originalname)
    req.getConnection((err, conn)=> {

        conn.query('UPDATE seguimiento set soporte_ejecucion_no_eficaz_dos = ?  where id = ?', [nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
        })
    })
    
})

app.use('/seguimiento', routes)

app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})