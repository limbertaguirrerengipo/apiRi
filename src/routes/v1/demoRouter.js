const express = require('express');
const router = express.Router();
const {validateHeaders} = require('../../midlwares/midlwares')
const {schemaValidarPago} = require('../../utils/validationsYup')
const {obtenerSolicitante} = require('../../controllers/DemoControllers')
/**
 * @swagger
 * /v1/demo:
 *  post:
 *      summary :  closing (Anticipo)
 *      description: closing (Anticipo)
 *      security:
 *          - basicAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/closing'
 *
 *
 *      tags:
 *          - [closing]
 *      responses:
 *          200:
 *            description: successful change payment plan
 *            content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/closingResponse'
 *          401:
 *            description: "Error Unauthorized"
 *
 */
router.get('/demo', validateHeaders(schemaValidarPago), obtenerSolicitante);

module.exports = router;