import { pool } from "@/config/mysql-conn";
import { isEmpty } from "lodash";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getTransactionCount(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getTransactionCount = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    let results = []
    if (start_date != null && start_date !== '' && end_date != null && end_date !== '') {
      results = await pool.query("SELECT COUNT(order_id) as count FROM transaction WHERE order_date >= ? AND order_date <= ? ", [
        start_date,
        end_date
      ])
    } else {
      results = await pool.query("SELECT COUNT(order_id) as count FROM transaction");
    }
    if (isEmpty(results)) results = [{ count: 0}]
    return res.status(200).json(results[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
