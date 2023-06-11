import { pool } from "@/config/mysql-conn";
import { isEmpty } from "lodash";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await saveRule(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const saveRule = async (req, res) => {
  try {
    const { confidence } = req.body;
    if (isEmpty(confidence)) return res.status(400).send("Tidak ada items yang memenuhi minimal support");
    const sql = "INSERT INTO rule (summary_id, rule, confidence, lift, description) VALUES ?"
    const result = await pool.query(sql, [confidence]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
