import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await saveSummary(req, res);
    case "GET":
      return await getSummary(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const saveSummary = async (req, res) => {
  try {
    const { start_date, end_date, min_support, min_confidence, total_order } = req.body;
    const result = await pool.query("INSERT INTO summary SET ?", {
      start_date,
      end_date,
      min_support,
      min_confidence,
      total_order,
      processed_date: new Date()
    });
    return res.status(200).json({ summary_id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM summary");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
