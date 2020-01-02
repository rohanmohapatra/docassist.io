import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal,
    Paper,
    Container,
    CssBaseline,
    Avatar,
    Typography,
    TextField,
    Checkbox,
    Button,
    Grid,
    Link,
    FormControlLabel,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import 'whatwg-fetch';
import Cookies from 'js-cookie';
import Google from './../../icons/Google';


const useStyles = makeStyles(theme => ({
    paperHolder: {
        position: 'absolute',
        width: '25rem',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: `10%`,
        left: `50%`,
        transform: `translate(-50%, -10%)`,
        minHeight: '70%',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    large: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        backgroundColor: 'grey',
    },
    avatarButton: {
        backgroundColor: 'grey',
        padding: '0.025rem',
        margin: '1rem',
    },
}));

const SignupForm = props => {
    const classes = useStyles();

    const [formState, setFormState] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = () => {
        if (formState.password !== formState.confirmPassword) {
            alert('password and confirm password not matching');
        } else {
            fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: formState,
                })
            })
                .then(resp => {
                    if (resp.status !== 200) {
                        const error = new Error(resp.statusText);
                        error.resp = resp;
                        throw error;
                    }
                    return resp;
                })
                .then(resp => resp.json())
                .then(json => {
                    if (json) {
                        Cookies.set('user', json);
                        console.log(Cookies.get('user'));
                        props.onLoS(json);
                    }
                })
                .catch(err => {
                    console.log(err.resp);

                    if (err.message.toLowerCase() === 'conflict') {
                        alert('User exists');
                    } else {
                        alert('Oops! Something went wrong. Try Again');
                    }
                });
        }
    }

    return (
        <>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <form
                className={classes.form}
                onSubmit={e => e.preventDefault()}
                noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={e => {
                        setFormState({
                            ...formState,
                            email: e.target.value,
                        });
                    }}
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={e => {
                        setFormState({
                            ...formState,
                            password: e.target.value,
                        });
                    }}
                    autoComplete="current-password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    onChange={e => {
                        setFormState({
                            ...formState,
                            confirmPassword: e.target.value,
                        });
                    }}
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Sign Up
                </Button>
            </form>
        </>
    );
}

const LoginForm = props => {
    const classes = useStyles();

    const [formState, setFormState] = React.useState({
        email: '',
        password: '',
    });

    const handleSubmit = () => {
        console.log(formState);
        fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: formState,
            })
        })
            .then(resp => {
                if (resp.status !== 200) {
                    const error = new Error(resp.statusText);
                    error.resp = resp;
                    throw error;
                } else {
                    return resp;
                }

            })
            .then(resp => resp.json())
            .then(json => {
                if (json) {
                    Cookies.set('user', json);
                    console.log(Cookies.get('user'));
                    props.onLoS(json);
                }
            })
            .catch(err => alert(err.message));
    }

    return (
        <>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form
                className={classes.form}
                onSubmit={e => e.preventDefault}
                noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={e => {
                        setFormState({
                            ...formState,
                            email: e.target.value,
                        });
                    }}
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={e => {
                        setFormState({
                            ...formState,
                            password: e.target.value,
                        });
                    }}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Sign In
                </Button>
            </form>
        </>
    );
}

const AccountInfoPage = props => {
    console.log(props);
    const classes = useStyles();

    const nameCookie = props.userStr;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <h1>
                    Welcome!
                </h1>
                <Avatar
                    alt={nameCookie.user._id}
                    src={`https://robohash.org/${nameCookie.user._id}.png?set=set5`}
                    className={classes.large}
                />
                <h5 style={{ color: 'grey' }}>
                    ID: {nameCookie.user._id}
                </h5>
                <h3>
                    {nameCookie.user.email}
                </h3>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={
                        () => {
                            Cookies.remove('user');
                            props.onLoS(undefined);
                        }
                    }
                >
                    Log Out
                </Button>
            </div>
        </Container>
    );
}

const LoginAndSignupForms = props => {
    const classes = useStyles();

    const handleSignupToggleClick = e => {
        setLocalSignIn(!localSignIn);
    }

    const [localSignIn, setLocalSignIn] = React.useState(true);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                {localSignIn ? <LoginForm onLoS={props.onLoS} /> : <SignupForm onLoS={props.onLoS} />}
                <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                        <Link href="#" onClick={handleSignupToggleClick}>
                            {localSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {/* <IconButton>
                    <Google />
                </IconButton>
                Sign up with Google
    
            <Button variant="contained">
                    <Google /> Sign up with Google
            </Button> */}
        </Container>
    );

}

const LoginComp = props => {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [open, setOpen] = React.useState(false);

    let nameCookie = Cookies.getJSON('user');

    if (nameCookie) {
        console.log('LoggedIn:', nameCookie);
    }

    // to hold state if the user is logged in
    const [loggedIn, setLoggedIn] = React.useState(nameCookie);

    console.log(loggedIn);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Avatar
                type="button"
                onClick={handleOpen}
                src={loggedIn ? `https://robohash.org/${nameCookie.user._id}.png?set=set5` : null}
                className={classes.avatarButton}
            >
                {loggedIn ? null : <AccountCircle />}
            </Avatar>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <Paper className={classes.paperHolder}>

                    {loggedIn ? <AccountInfoPage userStr={nameCookie} onLoS={tok => setLoggedIn(tok)} /> : <LoginAndSignupForms onLoS={tok => setLoggedIn(tok)} />}

                </Paper>
            </Modal>
        </div>
    );
};

export default LoginComp;