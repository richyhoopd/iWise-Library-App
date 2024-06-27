const router = require("express")()
const { BookModel } = require("../models/book")
const { UserModel } = require("../models/user")

const omitPassword = (user) => {
  const { password, ...rest } = user
  return rest
}

router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    return res.status(200).json({ users: users.map((user) => omitPassword(user.toJSON())) })
  } catch (err) {
    next(err)
  }
})

router.post("/borrow", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn })
    if (book == null) {
      return res.status(404).json({ error: "libro no encontrado" })
    }
    if (book.borrowedBy.length === book.quantity) {
      return res.status(400).json({ error: "libro no disponible" })
    }
    const user = await UserModel.findById(req.body.userId)
    if (user == null) {
      return res.status(404).json({ error: "User not found" })
    }
    if (book.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "ya tienes prestado este libro" })
    }
    await book.update({ borrowedBy: [...book.borrowedBy, user.id] })
    const updatedBook = await BookModel.findById(book.id)
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/return", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }
    const user = await UserModel.findById(req.body.userId)
    if (user == null) {
      return res.status(404).json({ error: "usuario no enontrado" })
    }
    if (!book.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "necesitas pedir prestado el libro primero!" })
    }
    await book.update({
      borrowedBy: book.borrowedBy.filter((borrowedBy) => !borrowedBy.equals(user.id)),
    })
    const updatedBook = await BookModel.findById(book.id)
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get("/borrowed-books", async (req, res, next) => {
  try {
    const result = await BookModel.find({ "borrowedBy": { "$in": req.session.userId } })
    return res.status(200).json({ books: result })
  } catch (err) {
    next(err)
  }
})

router.get("/profile", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
    if (user == null) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }
    return res.status(200).json({ user: omitPassword(user.toJSON()) })
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user == null) {
      return res.status(404).json({ error: "usuario no encontrado" })
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "contraseña invalida" })
    }
    req.session.userId = user.id
    return res.status(200).json({ user: omitPassword(user.toJSON()) })
  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const usr = await UserModel.findOne({ email: req.body.email });
    if (usr != null) {
      return res.status(400).json({ error: "Ya existe un usuario con ese correo electrónico." });
    }
    const newUsr = await UserModel.create(req.body);
    return res.status(200).json({ usr: omitPassword(newUsr.toJSON()) });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy()
  return res.status(200).json({ success: true })
})

module.exports = { router }
