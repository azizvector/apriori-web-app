import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getTransaction(req, res);
    case "DELETE":
      return await deleteTransaction(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getTransaction = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    let results = []
    if (start_date != null && start_date !== '' && end_date != null && end_date !== '') {
      results = await pool.query("SELECT * FROM transaction WHERE order_date >= ? AND order_date <= ? ", [
        start_date,
        end_date
      ])
    } else {
      results = await pool.query("SELECT * FROM transaction");
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const results = await pool.query("DELETE FROM transaction");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
