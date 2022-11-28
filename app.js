const express = require('express')
const mysql  = require('mysql')
const myconn = require('express-myconnection')
var cors = require('cors')
const multer = require('multer')
const nodemailer = require('nodemailer')
const fonts = require("./fonts")
const styles = require("./styles")
const content = require("./content")
const routes = require('./routes')
const PdfPrinter = require('pdfmake')
const fs = require('fs')
const path = require('path');




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
    host: 'bks3n7op2s05athvuyb4-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'u8h5y0ilxlkwiv5r',
    password: 'aLVm87i3CxaHhnKJjTEW',
    database: 'bks3n7op2s05athvuyb4'
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

        conn.query('UPDATE seguimiento set soporte_ejecucion = ?  where id = ?', ["https://apinodeinem.herokuapp.com/"+nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
            
        })
        
    })
    
})
app.post('/subir_dos/:id', cors(corsOptions), upload.single('file'), (req,res)=>{
    let name =  res.send(req.file.originalname)
    req.getConnection((err, conn)=> {

        conn.query('UPDATE seguimiento set soporte_ejecucion_no_eficaz_uno = ?  where id = ?', ["https://apinodeinem.herokuapp.com/"+nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
        })
    })
    
})

app.post('/subir_tres/:id', cors(corsOptions), upload.single('file'), (req,res)=>{
    let name =  res.send(req.file.originalname)
    req.getConnection((err, conn)=> {

        conn.query('UPDATE seguimiento set soporte_ejecucion_no_eficaz_dos = ?  where id = ?', ["https://apinodeinem.herokuapp.com/"+nombre, req.params.id], (err, rows)=>{
            console.log(nombre)
        })
    })
    
})


app.post('/enviar_correo/:id',cors(corsOptions),(req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('SELECT soporte_ejecucion_no_eficaz_uno,soporte_ejecucion,nombre, numero_accion,proceso_origen,no_conformidad,analisis_causas,tipo_de_accion,origen_accion,accion_descripcion, objetivo,responsable,correo_responsable,fecha,fecha_de_cierre,fecha_seguimiento_uno,observacion_uno,fecha_seguimiento_dos,observacion_dos FROM seguimiento where id = ?',[req.params.id], (err, rows)=>{
            if(err) return res.send(err)
           res.json(rows)
           //console.log(rows[0].correo_responsable, rows[0].numero_accion)
            var content = [
                {text: 'PDF SEGUIMIENTO '+ rows[0].numero_accion, style: 'header'},
                " ",
                " ",
                "Datos generados para el seguimiento",
                " ",
		{
			style: 'tableExample',
			table: {
				body: [
					['nombre', rows[0].nombre],
                    ['numero_accion', rows[0].numero_accion],
                    ['proceso_origen', rows[0].proceso_origen],
                    ['no_conformidad', rows[0].no_conformidad],
                    ['analisis_causas', rows[0].analisis_causas],
                    ['tipo_de_accion', rows[0].tipo_de_accion],
                    ['origen_accion', rows[0].origen_accion],
                    ['accion_descripcion', rows[0].accion_descripcion],
                    ['objetivo', rows[0].objetivo],
                    ['responsable', rows[0].responsable],
                    ['correo_responsable', rows[0].correo_responsable],
                    ['fecha', rows[0].fecha],
                    ['fecha_de_cierre', rows[0].fecha_de_cierre],
                    ['fecha_seguimiento_uno', rows[0].fecha_seguimiento_uno],
                    ['observacion_uno', rows[0].observacion_uno],
                    ['fecha_seguimiento_dos', rows[0].fecha_seguimiento_dos],
                    ['observacion_dos', rows[0].observacion_dos]
				]
			}
		},
        " ",
        " ",
        " ",
        {text:"Este PDF se genera automaticamente, cambios hablar con el encargado", style: "label"},
            ]
           let docDefinition = {
            content: content,
            styles: styles
        }
        const printer = new PdfPrinter(fonts)

        let pdfDoc = printer.createPdfKitDocument(docDefinition)
        pdfDoc.pipe(fs.createWriteStream("pdfs/pdfTest.pdf"))
        pdfDoc.end()

           async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();
          
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: "ludicolo2209@gmail.com", // generated ethereal user
                pass: "ijwtqvccamdhgpzr", // generated ethereal password
              },
            });
          
            // send mail with defined transport object
            mail = [rows[0].correo_responsable]
            let info = await transporter.sendMail({
                from: "ludicolo2209@gmail.com", // sender address
                to: mail,  // list of receivers
                subject: "Seguimiento "+rows[0].numero_accion, // Subject line
                text: "Sr/Sra "+rows[0].responsable + " Fue asignado al seguimiento "+rows[0].numero_accion+ " con fecha inicial "+rows[0].fecha+ " se agradece el debido proceso a realizar", // plain text body
                attachments: [{
                    filename: 'pdfTest.pdf',
                    path: path.join(__dirname, './pdfs/pdfTest.pdf'),
                    contentType: 'application/pdf'
                  }],
                  
              });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          }
          
          main().catch(console.error);
           
           
        })    
    })   
    
} )

app.get('/notificaciones', cors(corsOptions), (req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('SELECT * FROM seguimiento ORDER BY id DESC LIMIT 10',(err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
} )

app.get('/unico/:id', cors(corsOptions), (req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('SELECT * FROM seguimiento where id = ?',[req.params.id], (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
} )
    

app.use('/seguimiento', routes)

app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})

