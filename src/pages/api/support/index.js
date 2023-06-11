import { pool } from "@/config/mysql-conn";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
        return await saveSupport(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const saveSupport = async (req, res) => {
  try {
    const { supports } = req.body;
    const sql = "INSERT INTO support (summary_id, itemset, candidate, support) VALUES ?"
    const supportArray = supports.map(o=>[o.summary_id,o.itemset,o.candidate, o.support])
    const result = await pool.query(sql, [supportArray]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
