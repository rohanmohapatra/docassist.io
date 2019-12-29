import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import BackupIcon from '@material-ui/icons/Backup';
import ViewListIcon from '@material-ui/icons/ViewList';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import { SidebarNav} from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Upload Templates',
      href: '/upload/template',
      icon: <BackupIcon />
    },
    {
      title: 'View Templates',
      href: '/view/template',
      icon: <ViewListIcon />
    },
    {
      title : 'Bulk Generate',
      href: '/bulk/generate',
      icon: <AddToPhotosIcon />
    },
    {
      title : 'Add Client Data',
      href: '/upload/data',
      icon: <PersonAddIcon />
    },
    {
      title : 'View Clients',
      href: '/view/clients',
      icon: <PeopleIcon />
    }

  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
