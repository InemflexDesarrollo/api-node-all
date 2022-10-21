const express = require('express')
const routes = express.Router()
var cors = require('cors')


var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
     preflightContinue: false,
    optionsSuccessStatus: 204
  }

//rutas

routes.get('/:numero_accion', cors(corsOptions), (req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('SELECT * FROM seguimiento where numero_accion = ?',[req.params.numero_accion], (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
} )

routes.get('/', cors(corsOptions), (req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('SELECT * FROM seguimiento', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
} )



routes.post('/',cors(corsOptions),(req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('INSERT INTO seguimiento set ?',[req.body], (err, rows)=>{
            if(err) return res.send(err)

            res.send('seguimiento insert')
        })
    })
} )

routes.delete('/:id',cors(corsOptions),   (req, res)=>{
    req.getConnection((err, conn)=> {
        var articulo = req.params.id
        if(err) return res.send(err)

        conn.query('DELETE FROM seguimiento WHERE id = ?', [req.params.id], (err, rows)=>{
            if(err || !articulo)
            {
                return res.status(500).json({
                    status: "Error",
                    mensaje: "Metodo no borrado"
                })
            } 

            return res.status(200).json({
                status: "Success",
                mensaje: "Metodo  borrado"
            })
        })
    })
} )

routes.put('/:id',cors(corsOptions),  (req, res)=>{
    req.getConnection((err, conn)=> {
        if(err) return res.send(err)

        conn.query('UPDATE seguimiento set ? WHERE id = ?', [req.body, req.params.id], (err, rows)=>{
            if(err || !articulo)
            {
                return res.status(500).json({
                    status: "Error",
                    mensaje: "Metodo no borrado"
                })
            } 

            return res.status(200).json({
                status: "Success",
                mensaje: "Metodo  borrado"
            })
        })
    })
} )
module.exports = routes