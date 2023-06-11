import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSummary(req, res);
    case "DELETE":
      return await deleteSummary(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getSummary = async (req, res) => {
  try {
    const summary = await pool.query("SELECT * FROM summary WHERE summary_id = ?", [
      req.query.id,
    ]);
    const support = await pool.query("SELECT * FROM support WHERE summary_id = ? ORDER BY itemset DESC, support DESC", [
      req.query.id,
    ]);
    const confidence = await pool.query("SELECT * FROM rule WHERE summary_id = ? ORDER BY confidence DESC", [
      req.query.id,
    ]);
    return res.status(200).json({ summary: summary[0], support: support, confidence: confidence});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSummary = async (req, res) => {
  try {
    await pool.query("DELETE FROM support WHERE summary_id = ?", [req.query.id]);
    await pool.query("DELETE FROM rule WHERE summary_id = ?", [req.query.id]);
    await pool.query("DELETE FROM summary WHERE summary_id = ?", [req.query.id]);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};