const { json } = require('express');
const sgMail = require('@sendgrid/mail')
const {Pool} = require('pg');
 const pool = new Pool ({
    host: 'ec2-3-208-157-78.compute-1.amazonaws.com',
    user: 'ajeuwikenhshrf',
    password: '0ba066351cd30338be16aa410a26cc3deb6459a9792c1bfede5a47f71624bd3e',
    database: 'd36do3ba44vjh8',
    port: '5432',
    ssl: {
        rejectUnauthorized: false
      },
})

const getUsers = async (req,res) =>{
    const response = await pool.query('SELECT * FROM CLIENTES');
    res.json(response.rows); 
}
const createUsers = async (req,res) =>{
    const {nombres,ap_paterno,ap_materno,correo} = req.body;
    const response = await pool.query('INSERT INTO CLIENTES(nombres,ap_paterno,ap_materno,correo,dni,fnacimiento) VALUES ($1,$2,$3,$4,$5,$6)',[nombres,ap_paterno,ap_materno,correo,dni,fnacimiento]);
    res.send('user created');
}

const getSolicitudes = async (req,res) =>{
    const response = await pool.query('select * from solicitudes');
    res.json(response.rows);
}

const postSolicitudes = async (req,res) =>{
    const {cod_cliente,monto} = req.body;
    const fecha = new Date();
    const response = await pool.query('insert into solicitudes(cod_cliente,monto,estado,fecha) values ($1,$2,$3,$4)',[cod_cliente,monto,'En Proceso',fecha]);
    res.send('solicitud created');
}

const postAgregar = async (req,res) =>{
    const {nombres,ap_paterno,ap_materno,correo,monto,dni,fnacimiento} = req.body;
    const response = await pool.query('INSERT INTO CLIENTES(nombres,ap_paterno,ap_materno,correo,dni,fnacimiento) VALUES ($1,$2,$3,$4,$5,$6) returning cod_cliente',[nombres,ap_paterno,ap_materno,correo,dni,fnacimiento]);
 
    const {cod_cliente} = response.rows[0]; 
    const fecha = new Date();
    await pool.query('insert into solicitudes(cod_cliente,monto,estado,fecha) values ($1,$2,$3,$4)',[cod_cliente,monto,'En Proceso',fecha]); 

    const sendMail = (req, res) => {

        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
        const msg = {
            to: correo,
            from: 'labantom.@unitru.edu.pe',
            subject: `Estado de Solicitud - Cliente (${nombres} ${ap_paterno} ${ap_materno})`,
            text: 'Su solicitud ha sido enviada, su estado actual es EN PROCESO.',
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                res.status(200).json({message: 'Email sent'});
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json( { message : 'Error sending email', res : error });
            });
    }

}
const consultar = async (req,res) =>{
    const {dni} = req.body;
    const response = await pool.query('select cl.nombres,concat_ws(\' \', cl.ap_paterno,cl.ap_materno) as apellidos,to_char(sl.fecha, \'DD/MM/YYYY\') as fecha, sl.monto,sl.estado from clientes cl inner join solicitudes sl on cl.cod_cliente = sl.cod_cliente where cl.dni = $1',[dni]);
    res.json(response.rows[0]);
}

const mensaje = (req,res) =>{
    res.send('holiwis');
 /*    sgMail.setApiKey('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');

    const msg = {
        to: 'luchitoabantomartinez@gmail.com',
        from: 'juecepeprestamos@gmail.com',
        subject: `Estado de Solicitud - Cliente`,
        text: 'Su solicitud ha sido enviada, su estado actual es EN PROCESO.',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
            res.status(200).json({message: 'Email sent'});
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json( { message : 'Error sending email', res : error });
        }); */
}

module.exports = {
    getUsers,
    createUsers,
    getSolicitudes,
    postSolicitudes,
    postAgregar,
    mensaje,
    consultar
};