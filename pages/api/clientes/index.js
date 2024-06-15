// pages/api/clientes/index.js
const pool = require('../../../config/database');

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM clientes');
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los clientes' });
      }
      break;
    case 'POST':
      try {
        const { identificacion, nombre, direccion, ciudad, email, telefono } = req.body;
        const result = await pool.query(
          'INSERT INTO clientes (identificacion, nombre, direccion, ciudad, email, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [identificacion, nombre, direccion, ciudad, email, telefono]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el cliente' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} no permitido`);
      break;
  }
};
