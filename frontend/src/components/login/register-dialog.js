import { useState, forwardRef } from "react";
import Swal from "sweetalert2";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Typography,
} from "@mui/material";
import { UserApi } from "../../client/backend-api/user.js";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const RegisterDialog = ({ open, handleClose, handleSubmit, openLoginDialog }) => {
    const [newUsr, setNewUsr] = useState({
        username: "",
        password: "",
    });

    const isInvalid = newUsr.username.trim() === "" || newUsr.password.trim() === "";

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!isInvalid) {
            try {
                const response = await UserApi.register(newUsr);
                if (response.error) {
                    Swal.fire({
                        title: "Error en el registro!",
                        text: response.error.message || "Hubo un problema al crear la cuenta.",
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        title: "Registro Exitoso!",
                        text: "Inicia sesión para comenzar a rentar libros",
                        icon: "success"
                    });
                    handleSubmit(response.usr);
                    handleClose();
                }
            } catch (error) {
                console.error("Registration error:", error);
                Swal.fire({
                    title: "Error en el registro!",
                    text: error.message || "Hubo un problema al crear la cuenta.",
                    icon: "error"
                });
            }
        }
    };

    const handleEnterKeyDown = (event) => {
        if (event.key === "Enter") {
            onSubmit(event);
        }
    };

    const updateUserField = (event) => {
        const { name, value } = event.target;
        setNewUsr((newUsr) => ({ ...newUsr, [name]: value }));
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            onKeyDown={handleEnterKeyDown}
        >
            <DialogTitle>Crear cuenta</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newUsr.username}
                    onChange={updateUserField}
                />
                <TextField
                    margin="dense"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={newUsr.password}
                    onChange={updateUserField}
                />
                <Typography variant="body2" align="center" style={{ marginTop: 16 }}>
                    ¿Ya tienes una cuenta?{" "}
                    <Button onClick={openLoginDialog} color="primary">
                        Inicia sesión
                    </Button>
                </Typography>
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
    );
};
