const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const sessions = require("express-session")
const { apiV1 } = require("./routes")
const { connectDb } = require("./db")
const { UserModel } = require("./models/user")
const path = require('path')  // Asegúrate de importar el módulo path

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
  })
)

app.use("/v1", apiV1)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" })
})

app.use((err, req, res, next) => {
  console.error("Error:", err)
  return res.status(500).json({ error: "Unknown server error" })
})

connectDb()
  .then(async () => {
    const admin = await UserModel.findOne({email: "admin@email.com" })
    if (admin == null) {
      await UserModel.create({ username: "administrador", email: "admin@email.com", password: "admin", role: "admin" })
    }
    const guest = await UserModel.findOne({ email: "guest@email.com" })
    if (guest == null) {
      await UserModel.create({ username: "guestt",  email: "guest@email.com", password: "guest", role: "guest" })
    }
  })
  .then(() => {
    const port = process.env.PORT || 8080;  // Usar el puerto de las variables de entorno
    app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))
  })
  .catch((err) => {
    console.error("Failed to connect to database", err)
    process.exit(1)
  })
