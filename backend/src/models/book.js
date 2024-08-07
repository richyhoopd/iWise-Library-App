const { model, Schema } = require("mongoose")

const BookModel = model(
  "books",
  new Schema({
    name: { type: String, required: true },

    // implementar logica de esto en el controlador
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    year: { type: Number, required: true },
    // hasta aqui
    
    isbn: { type: String, required: true, unique: true },
    category: { type: String, required: true },

    quantity: { type: Number, required: true },
    borrowedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    priceHistory: { type: Array, required: true, default: [] },
    quantityHistory: { type: Array, required: true, default: [] },
  })
)

module.exports = { BookModel }
