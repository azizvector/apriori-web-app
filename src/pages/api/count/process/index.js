import { pool } from "@/config/mysql-conn";
import { isEmpty } from "lodash";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSummaryCount(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getSummaryCount = async (req, res) => {
  try {
    const results = await pool.query("SELECT COUNT(summary_id) as count FROM summary");
    if (isEmpty(results)) results = [{ count: 0}]
    return res.status(200).json(results[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
