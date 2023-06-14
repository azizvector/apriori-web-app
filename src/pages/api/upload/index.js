import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await uploadTransactions(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}
const uploadTransactions = async (req, res) => {
  try {
    const sql = "INSERT INTO transaction (order_id, order_date, products) VALUES ?";
    const result = await pool.query(sql, [req.body]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};