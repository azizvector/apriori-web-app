import { pool } from "@/config/mysql-conn";
import { isEmpty } from "lodash";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await login(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const checkUser = await pool.query("SELECT * FROM user WHERE username = ?", [username]);
    if (isEmpty(checkUser)) return res.status(400).send("Method not allowed");
    const checkPassword = await password === checkUser[0].password;
    if (!checkPassword) return res.status(400).send("Method not allowed");
    const token = jwt.sign({
      id: checkUser[0].user_id,
      username: checkUser[0].username,
      name: checkUser[0].name
    }, "apriori", {
      expiresIn: '7d'
    })
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json({ error });
  }
};