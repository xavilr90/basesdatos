// pages/api/clientes/[id].js
const pool = require('../../../config/database');

export default async (req, res) => {
  const { method, query: { id } } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Cliente no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente' });
      }
      break;
    case 'PUT':
      try {
        const { identificacion, nombre, direccion, ciudad, email, telefono } = req.body;
        const result = await pool.query(
          'UPDATE clientes SET identificacion = $1, nombre = $2, direccion = $3, ciudad = $4, email = $5, telefono = $6 WHERE id = $7 RETURNING *',
          [identificacion, nombre, direccion, ciudad, email, telefono, id]
        );
        if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Cliente no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cliente' });
      }
      break;
    case 'DELETE':
      try {
        const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
          res.status(200).json({ message: 'Cliente eliminado' });
        } else {
          res.status(404).json({ error: 'Cliente no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cliente' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} no permitido`);
      break;
  }
};
