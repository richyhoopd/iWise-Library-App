import { useState, forwardRef } from "react"
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from "@mui/material"

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const LoginDialog = ({ open, handleClose, handleSubmit }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = (event) => {
        event.preventDefault()
        handleSubmit(email, password)
    }

    const handleEnterKeyDown = (event) => {
        if (event.key === "Enter") {
            onSubmit(event)
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            onKeyDown={handleEnterKeyDown}
        >
            <DialogTitle>Iniciar Sesión</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    label="Email"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="contained" type="submit" onClick={onSubmit}>
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
