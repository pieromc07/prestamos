const { Router } = require('express');
const router = Router();

const { getUsers, createUsers,getSolicitudes,postSolicitudes,postAgregar,mensaje,consultar} = require('../controllers/index.controller');

router.get('/users', getUsers);
router.post('/users', createUsers);
router.get('/solicitudes',getSolicitudes);
router.post('/solicitudes',postSolicitudes);
router.post('/agregar', postAgregar);
router.get('/', mensaje);
router.post('/consultar', consultar ); 
module.exports = router;















/* router.get('/consultar/:dni',  async (req, res) => {
    const dni = req.params.dni;
    const response = await hola.query('select cl.dni,cl.nombres,concat_ws(\' \', cl.ap_paterno,cl.ap_materno) as apellidos,sl.fecha, sl.monto,sl.estado from clientes cl inner join solicitudes sl on cl.cod_cliente = sl.cod_cliente where cl.dni = $1',[dni]);
    res.json(response.rows);
  }) */
