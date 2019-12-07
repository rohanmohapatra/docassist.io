import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

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

const UploadTemplate = () => {
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
              Hello, UserA
            </Typography>
            <Typography variant="subtitle2">
              Upload your templates here (You can upload multiple templates)
            </Typography>
            <FilePond allowMultiple={true} server="http://localhost:5000/api/templates/upload/" name="template"/>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UploadTemplate;
