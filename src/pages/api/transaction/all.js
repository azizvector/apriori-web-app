import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      return await deleteTransaction(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const results = await pool.query("DELETE FROM transaction");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
