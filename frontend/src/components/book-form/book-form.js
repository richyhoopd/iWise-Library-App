import React, { useState, useEffect } from "react"
import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useParams, useNavigate } from "react-router-dom"
import {
    Paper,
    Container,
    Button,
    TextField,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import classes from "./styles.module.css"

dayjs.extend(utc)

export const BookForm = () => {
    const { bookIsbn } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState({
        name: "",
        author: "",
        pages: 0,
        year: 0,
        isbn: bookIsbn || "",
        category: "",
        quantity: 0,
        quantityHistory: [],
    })
    const [errors, setErrors] = useState({
        name: "",
        isbn: "",
        author: "",
        pages: "",
        year: "",
        category: "",
        quantity: "",
    })

    const isInvalid =
        book.name.trim() === "" || book.isbn.trim() === "" || book.category.trim() === "" 

    const formSubmit = (event) => {
        event.preventDefault()
        if (!isInvalid) {
            if (bookIsbn) {

                const newQuantity = parseInt(book.quantity, 10)

                let newQuantityHistory = book.quantityHistory.slice()

                if (
                    newQuantityHistory.length === 0 ||
                    newQuantityHistory[newQuantityHistory.length - 1].quantity !== newQuantity
                ) {
                    newQuantityHistory.push({ quantity: newQuantity, modifiedAt: dayjs().utc().format() })
                }
                BackendApi.book
                    .patchBookByIsbn(bookIsbn, {
                        ...book,

                        quantityHistory: newQuantityHistory,
                    })
                    .then(() => navigate(-1))
            } else {
                BackendApi.book
                    .addBook({
                        ...book,

                        quantityHistory: [{ quantity: book.quantity, modifiedAt: dayjs().utc().format() }],
                    })
                    .then(() => navigate("/"))
            }
        }
    }

    const updateBookField = (event) => {
        const field = event.target
        setBook((book) => ({ ...book, [field.name]: field.value }))
    }

    const validateForm = (event) => {
        const { name, value } = event.target
        if (["name", "author", "pages", "year", "isbn", "quantity"].includes(name)) {
            setBook((prevProd) => ({ ...prevProd, [name]: value.trim() }))
            if (!value.trim().length) {
                setErrors({ ...errors, [name]: `${name} no puede estar vacio` })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
        if (["quantity", "year", "pages"].includes(name)) {
            if (isNaN(Number(value))) {
                setErrors({ ...errors, [name]: "solo se permite ingresar numeros" })
            } else {
                setErrors({ ...errors, [name]: "" })
            }
        }
    }

    useEffect(() => {
        if (bookIsbn) {
            BackendApi.book.getBookByIsbn(bookIsbn).then(({ book, error }) => {
                if (error) {
                    navigate("/")
                } else {
                    setBook(book)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookIsbn])

    return (
        <>
            <Container component={Paper} className={classes.wrapper}>
                <Typography className={classes.pageHeader} variant="h5">
                    {bookIsbn ? "Actualizar libro" : "Agregar Nuevo Libro"}
                </Typography>
                <form noValidate autoComplete="off" onSubmit={formSubmit}>
                    <FormGroup>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Nombre"
                                name="name"
                                required
                                value={book.name}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.name.length > 0}
                                helperText={errors.name}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Autor"
                                name="author"
                                required
                                value={book.author}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.author.length > 0}
                                helperText={errors.author}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Numero de Paginas"
                                name="pages"
                                type="number"
                                value={book.pages}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.pages.length > 0}
                                helperText={errors.pages}
                            />
                            
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Año de publicación"
                                name="year"
                                type="number"
                                value={book.year}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.year.length > 0}
                                helperText={errors.year}
                            />
                            
                        </FormControl>
                        
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Clave"
                                name="isbn"
                                required
                                value={book.isbn}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.isbn.length > 0}
                                helperText={errors.isbn}
                            />
                        </FormControl>
                        <FormControl className={classes.mb2}>
                            <InputLabel>Categoria</InputLabel>
                            <Select name="category" value={book.category} onChange={updateBookField} required>
                                <MenuItem value="Biografías">Biografías</MenuItem>
                                <MenuItem value="Desarrollo Personal">Desarrollo Personal</MenuItem>
                                <MenuItem value="Empoderamiento Femenino">Empoderamiento Femenino</MenuItem>
                                <MenuItem value="Liderazgo">Liderazgo</MenuItem>
                                <MenuItem value="Negocios y Finanzas">Negocios y Finanzas</MenuItem>
                                <MenuItem value="Novelas">Novelas</MenuItem>
                                <MenuItem value="Poemas">Poemas</MenuItem>
                                <MenuItem value="Tecnologia">Tecnología</MenuItem>
                                <MenuItem value="Revistas">Revistas</MenuItem>
                                <MenuItem value="Inovacion">Inovación</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                                
                            </Select>
                        </FormControl>
                        
                        <FormControl className={classes.mb2}>
                            <TextField
                                label="Cantidad"
                                name="quantity"
                                type="number"
                                value={book.quantity}
                                onChange={updateBookField}
                                onBlur={validateForm}
                                error={errors.quantity.length > 0}
                                helperText={errors.quantity}
                            />
                        </FormControl>
                    </FormGroup>
                    <div className={classes.btnContainer}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                navigate(-1)
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isInvalid}>
                            {bookIsbn ? "Actualizar Libro" : "Agregar Libro"}
                        </Button>
                    </div>
                </form>
            </Container>
        </>
    )
}
