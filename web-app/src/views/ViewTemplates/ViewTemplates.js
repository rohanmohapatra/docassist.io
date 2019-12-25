import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import axios from 'axios';
import { TemplateCard } from './components';
import mockData from './data';
import { pathToFileURL } from 'url';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));



const ViewTemplates = props => {
  const classes = useStyles();

  const [products] = useState(mockData);

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        var host = 'localhost'
        var apiBaseUrl = '/api/templates/view_list/';
        var apiBasePort = '5000';
        const result = await axios({
            url: 'http://localhost:5000'+apiBaseUrl,
          });
          if(result.status === 200){
            console.log("Status is 200")
            setTemplates(result.data);
            console.log(result.data);
        }
      };
        fetchData();
  },[]);

  function onAction(action, payload) {
    if(action === 'useTemp') {
      console.log(action, props, payload);
      props.history.push('/upload/data', payload);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
        >
          {templates.map(template => (
            <Grid
              item
              key={template._id}
              lg={3}
              md={6}
              xs={12}
            >
              <TemplateCard template={template} onAction={onAction} />
            </Grid>
          ))}
        </Grid>
      </div>
      {false &&
      <div className={classes.pagination}>
        <Typography variant="caption">1-6 of 20</Typography>
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </div>
      }
    </div>
  );
};

export default ViewTemplates;
