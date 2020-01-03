import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Button, Grid, IconButton } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import theme from '../../theme';
import LoginComp from '../login';

const useStyles = makeStyles(() => ({
  root: {
    //boxShadow: 'none'
    backgroundColor: theme.palette.navbar.dark,
  },
  navbarButton: {
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5
  }

}));
const BootstrapButton = withStyles({
  root: {
    boxShadow: 'none',
    fontSize: 16,
    padding: '6px 12px',

    lineHeight: 1.5,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#262626',
      borderColor: 'white',
      border: '1px solid',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    }
  },
})(Button);

const NavBar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const handleLogout = () =>{
    localStorage.removeItem('username');
    window.location.href="/sign-in";
  }
  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <Grid
          justify="space-between" // Add it here :)
          container
          spacing={24}
        >
          <Grid item>
            <RouterLink to="/">
              <img
                alt="Logo"
                src="/images/logos/docassist.io_black.png"
                height='70'
              />
            </RouterLink>
          </Grid>
          <Grid item>
            <BootstrapButton href="/upload/template" color="inherit" className={classes.navbarButton}>Upload Template</BootstrapButton>
            <BootstrapButton href="/view/template" color="inherit" className={classes.navbarButton}>View Templates</BootstrapButton>
            <BootstrapButton href="/view/generated" color="inherit" className={classes.navbarButton}>View Generated Documents</BootstrapButton>
          </Grid>
          <Grid
            justify="center"
          >
            <LoginComp />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  className: PropTypes.string
};

export default NavBar;
