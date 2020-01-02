import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import axios from 'axios';
import { TemplateCard, SuccessBar } from './components';

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

  const [templates, setTemplates] = useState([]);
  const [emstatus, setEmStatus]  = useState(false);

  const setEmailStatus = function(data){
    console.log(data);
    setEmStatus(data);
  }
  useEffect(() => {
    const fetchData = async () => {
        var host = 'localhost'
        var apiBaseUrl = '/api/data/generated_docs_list';
        var apiBasePort = '5000';
        const result = await axios({
            url: `http://${host}:${apiBasePort}${apiBaseUrl}`,
          });
          if(result.status === 200){
            console.log("Status is 200")
            setTemplates(result.data);
            console.log(result.data);
        }
      };
        fetchData();
  },[]);
  const refreshTemplates = function(){
    const fetchData = async () => {
        var host = 'localhost'
        var apiBaseUrl = '/api/data/generated_docs_list';
        var apiBasePort = '5000';
        const result = await axios({
            url: `http://${host}:${apiBasePort}${apiBaseUrl}`,
          });
          if(result.status === 200){
            console.log("Status is 200")
            setTemplates(result.data);
            console.log(result.data);
        }
      };
        fetchData();
  }

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
              <TemplateCard template={template} onAction={onAction} callback={setEmailStatus} refreshTemplates={refreshTemplates}/>
            </Grid>
          ))}
        </Grid>
       {emstatus && <SuccessBar open={true} />}
      </div>
    </div>
  );
};

export default ViewTemplates;
