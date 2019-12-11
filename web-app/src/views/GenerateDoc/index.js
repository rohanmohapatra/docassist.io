import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(4)
    },
    content: {
      paddingTop: 150,
      textAlign: 'center'
    },
    image: {
      marginTop: 50,
      display: 'inline-block',
      maxWidth: '100%',
      width: 560
    }
  }));
  
  const GenerateDoc = props => {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={6}
            xs={12}
          >
            <div className={classes.content}>
              <Typography variant="h1">
                Upload Data
              </Typography>
              <Typography variant="subtitle2">
                Upload data for {props.location.state.templateName} template.
              </Typography>
              <FilePond allowMultiple={true} server="http://localhost:5000/api/templates/upload/" name="template"/>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

export default GenerateDoc;
