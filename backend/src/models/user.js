const { model, Schema } = require("mongoose")

const UserModel = model(
  "users",
  new Schema({
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "guest" },
  })
)

module.exports = { UserModel }
