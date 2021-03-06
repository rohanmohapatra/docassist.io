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
  Divider,
  Button
} from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BuildIcon from '@material-ui/icons/Build';
import IconButton from '@material-ui/core/IconButton';
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
    marginTop: 10,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18
  },
  version:{
    fontFamily: 'Montserrat',
    fontWeight: 300,
    fontSize: 15
  },
  verified:{
    color : theme.palette.primary.main,
    fontSize: 15
    },
    docx:{
      color : '#537EC0',
    },
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
          align="left"
          gutterBottom
          variant="h4"
          className={classes.filename}
        >
          {template.filename} <VerifiedUserIcon className={classes.verified} />
        </Typography>
       
        <Typography
          align="left"
          gutterBottom
          variant="body"
          component="p"
          className={classes.version}
        >
          Version : {template.version}
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
              <IconButton onClick={e => props.onAction('useTemp', { templateName: template.filename, templateId: template._id })}>
                <BuildIcon />
              </IconButton>
              
            </Typography>
            <Button variant="contained" color="primary" className={classes.button} href={"/edit/template/"+template._id}>
                Edit
            </Button>
            <IconButton href={"http://localhost:5000/api/media/download_template/"+template.filename}>
                <GetAppIcon className={classes.docx}/>
              </IconButton>
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
