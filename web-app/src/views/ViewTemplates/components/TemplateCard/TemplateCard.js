import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 200,
    width: 200,
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  filename:{
    fontFamily: 'Montserrat',
    fontWeight: 600
  }
}));

const TemplateCard = props => {
  const { className, template, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.imageContainer}>
          <img
            alt="template"
            className={classes.image}
            src='/images/static/google_docs.png'
          />
        </div>
        <Typography
          align="center"
          gutterBottom
          variant="h4"
          className={classes.filename}
        >
          {template.filename}
        </Typography>
        
      </CardContent>
      <Divider />
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Grid
            className={classes.statsItem}
            item
          >
            <Typography
              display="inline"
              variant="body2"
            >
              Add Necessaty Buttons
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

TemplateCard.propTypes = {
  className: PropTypes.string,
  template: PropTypes.object.isRequired
};

export default TemplateCard;
