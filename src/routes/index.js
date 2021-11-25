const { Router } = require('express');
const router = Router();

const { getUsers, createUsers,getSolicitudes,postSolicitudes,postAgregar,mensaje,consultar} = require('../controllers/index.controller');

router.get('/users', getUsers);
router.post('/users', createUsers);
router.get('/solicitudes',getSolicitudes);
router.post('/solicitudes',postSolicitudes);
router.post('/agregar', postAgregar);
router.get('/send', mensaje);
router.get('/', (req, res)=>{
  res.send('Hola Mundo');
});
router.post('/consultar', consultar ); 
module.exports = router;














