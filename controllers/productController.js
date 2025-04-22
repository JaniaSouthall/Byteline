const pool = require('../config/dbPostgresql');

exports.getAllProducts = async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
};

exports.createProduct = async (req, res) => {
  const { id, name, description, price, stock_quantity, category_id, images, reviews } = req.body;
  const query = `
    INSERT INTO products (id, name, description, price, stock_quantity, category_id, images, reviews, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
    RETURNING *`;
  const values = [id, name, description, price, stock_quantity, category_id, images, reviews];
  const result = await pool.query(query, values);
  res.status(201).json(result.rows[0]);
};
