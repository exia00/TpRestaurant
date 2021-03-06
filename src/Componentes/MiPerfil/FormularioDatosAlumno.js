import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Grid, Typography, TextField, ButtonBase, Button } from '@material-ui/core';
import RenderAvatar from '../login/RenderAvatar';
import GuestInfo from '../../Models/Guest/GuestInfo';
import GuestAPI from './../../Network/Guest/GuestAPI';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorMessageModal from '../Commons/ErrorMessageModal';
import '../../Styles/Common.css'

const styles = theme => ({
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    image: {
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
        },
        '&:hover': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.6,
                borderRadius: 60,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {

                display: "block",
            },
        },
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0,
        borderRadius: 60,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        display: "none",
        fontFamily: "Montserrat, sans-serif",
    },
    imageMarked: {
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        transition: theme.transitions.create('opacity'),
    },
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    input: {
        display: 'none',
    },
})

class FormularioDatosAlumno extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotoPerfil: "",
            nombre: "",
            apellido: "",
            tipo: "",
            documento: "",
            correo: "",
            pais: "",
            estado: "",
            ciudad: "",
            codigoPostal: "",
            direccion1: "",
            direccion2: "",
            telefono1: "",
            telefono2: "",
            edicion: false,
            redOnly: true,
            completado: false,
            loading: false,
            errorMessageIsOpen: false,
            errorMessage: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.edicionOpen = this.edicionOpen.bind(this);
        this.guardar = this.guardar.bind(this);
    }

    componentDidMount() {
        const user = this.props.user
        var array = user.displayName.split(" ");
        var nombre = array[0]
        var apellido = array[1]



        this.setState({
            correo: user.email,
            nombre: nombre,
            apellido: apellido,

        })

        this.getGuestInfo()
    }

    edicionOpen() {
        this.setState({ edicion: true, redOnly: false })
    }

    guardar() {
        this.setState({ edicion: false, redOnly: true })
        if (this.state.nombre !== "" &&
            this.state.apellido !== "" &&
            this.state.tipo !== "" &&
            this.state.documento !== "" &&
            this.state.correo !== "" &&
            this.state.pais !== "" &&
            this.state.estado !== "" &&
            this.state.ciudad !== "" &&
            this.state.codigoPostal !== "" &&
            this.state.direccion1 !== "",
            this.state.telefono1 !== ""
        ) {
            this.props.callPerfilCompletado()
            var dict = this.getGuestModel();
            GuestInfo.getInstance().setUserData(dict);
            this.postGuestInfo()
        } else {
            this.setState({
                errorMessageIsOpen: true,
                errorMessage: "Verifique si lleno todos los datos."
            });
        }
    }


    getGuestModel() {
        return {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            tipo: this.state.tipo,
            documento: this.state.documento,
            email: this.state.correo,
            pais: this.state.pais,
            estado: this.state.estado,
            ciudad: this.state.ciudad,
            codigoPostal: this.state.codigoPostal,
            direccion1: this.state.direccion1,
            direccion2: this.state.direccion2,
            telefono1: this.state.telefono1,
            telefono2: this.state.telefono2
            
            // etc.
        };
    }

    //Api Calls
    postGuestInfo = () => {
        this.setState({ loading: true });
        GuestAPI.postGuestInfo(this.handlePostGuestInfo);
    }

    handlePostGuestInfo = async (guestInfo) => {
        this.setState({ loading: false });
        if (guestInfo.error == null) {
            //post was successful
            console.log("Guardado con exito")
        } else {
            //get user with email failed
            console.log("Errrooor pa")
        }
    }

    getGuestInfo() {

        let guestInfo = GuestInfo.getInstance().getGuestData()
        this.handleGetGuestInfo(guestInfo)
    }

    handleGetGuestInfo(guestInfo) {

        if (guestInfo === undefined || guestInfo === null) {
            //show error message if needed
        } else {
            let userData = guestInfo.state;
            this.setState({
                apellido: userData.apellido,
                nombre: userData.nombre,
                email: userData.email,
                tipo: userData.tipo,
                documento: userData.documento,
                pais: userData.pais,
                estado: userData.estado,
                ciudad: userData.ciudad,
                codigoPostal: userData.codigoPostal,
                direccion1: userData.direccion1,
                direccion2: userData.direccion2,
                telefono1: userData.telefono1,
                telefono2: userData.telefono2
            });
            this.props.callPerfilCompletado()

        }
    }

    botonGuardar() {
        if (this.state.edicion)
            return (
                <Button variant="outlined" onClick={this.guardar} >Guardar</Button>
            )
    }

    showLoaderIfNeeded() {
        if (this.state.loading)
            return (
                <div className="loader">
                    <CircularProgress disableShrink />;
                </div>
            )
    }

    //Modal handlers
    closeErrorModal() {
        this.setState({ errorMessageIsOpen: false }, this.forceUpdate());
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { classes } = this.props;

        if (this.props.modo === "Perfil" || this.props.numero === 1) {

            return (
                <Grid>
                    {this.showLoaderIfNeeded()}
                    <ErrorMessageModal title={'Algo sali?? mal'} errorMessage={this.state.errorMessage} isOpen={this.state.errorMessageIsOpen} closeErrorModal={this.closeErrorModal.bind(this)} />

                    <Grid container spacing={3}>
                        <Grid item xs={4} md={3}>
                            <Button variant="contained" color="primary" onClick={this.edicionOpen}>Editar</Button>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            {this.botonGuardar()}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
                                <label htmlFor="contained-button-file">
                                    <ButtonBase
                                        focusRipple
                                        className={classes.image}
                                        focusVisibleClassName={classes.focusVisible}
                                        component="span"
                                    >
                                            <Typography
                                                component="span"
                                                variant="subtitle1"
                                                color="inherit"
                                                className={classes.imageTitle}
                                            >
                                                Editar
                                     </Typography>
                                    </ButtonBase>
                                </label>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Nombre"
                                name="nombre"
                                label="Nombre"
                                fullWidth
                                autoComplete="Nombre"
                                value={this.state.nombre}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Apellido"
                                name="apellido"
                                label="Apellido"
                                fullWidth
                                autoComplete="Apellido"
                                value={this.state.apellido}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Tipo"
                                name="tipo"
                                label="Tipo Documento"
                                fullWidth
                                autoComplete="Tipo"
                                value={this.state.tipo}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="documento"
                                name="documento"
                                label="Nro documento "
                                fullWidth
                                autoComplete="documento"
                                value={this.state.documento}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Correo"
                                name="correo"
                                label="Correo Electronico"
                                fullWidth
                                autoComplete="Correo"
                                value={this.state.correo}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Pa??s"
                                name="pais"
                                label="Pa??s"
                                fullWidth
                                autoComplete="Pa??s"
                                value={this.state.pais}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="Estado"
                                name="estado"
                                label="Estado/Provincia/Regi??n"
                                fullWidth
                                value={this.state.estado}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Ciudad"
                                name="ciudad"
                                label="Ciudad"
                                fullWidth
                                autoComplete="Ciudad"
                                value={this.state.ciudad}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="C??digo Postal"
                                name="codigoPostal"
                                label="C??digo Postal"
                                fullWidth
                                autoComplete="C??digo Postal"
                                value={this.state.codigoPostal}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Direccion"
                                name="direccion1"
                                label="Direccion"
                                fullWidth
                                autoComplete="Direccion"
                                value={this.state.direccion1}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Direccion2"
                                name="direccion2"
                                label="Direccion 2 (Opcional)"
                                fullWidth
                                autoComplete="Direccion"
                                value={this.state.direccion2}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Telefono1"
                                name="telefono1"
                                label="Telefono contacto"
                                fullWidth
                                autoComplete="Telefono1"
                                value={this.state.telefono1}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Telefono2"
                                name="telefono2"
                                label="Telefono contacto 2 (Opcional)"
                                fullWidth
                                autoComplete="Telefono2"
                                value={this.state.telefono2}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: this.state.redOnly,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            );

        } else {
            return (
                <Grid>
                    <Typography variant="h6" gutterBottom>
                        Datos Personales
                     </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Nombre"
                                name="nombre"
                                label="Nombre"
                                fullWidth
                                autoComplete="Nombre"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Apellido"
                                name="apellido"
                                label="Apellido"
                                fullWidth
                                autoComplete="Apellido"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Tipo"
                                name="tipo"
                                label="Tipo Documento"
                                fullWidth
                                autoComplete="Tipo"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="documento"
                                name="documento"
                                label="Nro documento "
                                fullWidth
                                autoComplete="documento"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Correo"
                                name="correo"
                                label="Correo Electronico"
                                fullWidth
                                autoComplete="Correo"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Pa??s"
                                name="pais"
                                label="Pa??s"
                                fullWidth
                                autoComplete="Pa??s"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="Estado"
                                name="estado"
                                label="Estado/Provincia/Regi??n"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="Ciudad"
                                name="ciudad"
                                label="Ciudad"
                                fullWidth
                                autoComplete="Ciudad"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="C??digo Postal"
                                name="codigoPostal"
                                label="C??digo Postal"
                                fullWidth
                                autoComplete="C??digo Postal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="Direccion"
                                name="direccion"
                                label="Direccion"
                                fullWidth
                                autoComplete="Direccion"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            );
        }


    }
}

FormularioDatosAlumno.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormularioDatosAlumno);