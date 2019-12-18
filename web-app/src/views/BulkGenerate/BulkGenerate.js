import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { ClientsTable, TemplatesTable, SuccessBar } from './components';
import axios from 'axios';
import { Grid, Typography, Divider, Snackbar } from '@material-ui/core';

import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  content: {
    marginTop: theme.spacing(2)
  },
  table: {
      marginLeft : 50
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const BulkGenerate = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const [selected, setSelected] = useState({clients: [], templates: []});
  const bulkCallback = (dataFromChild) => {
    //console.log(dataFromChild);
    
    if(dataFromChild.clients){
        setSelected(prevState => {
            let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
            //console.log(client_obj);
            client_obj.clients= dataFromChild.clients;                     // update the name property, assign a new value                 
            return client_obj ;                                 // return new object jasper object
          })
        }
    else if(dataFromChild.templates){
        setSelected(prevState => {
            let templates_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
            //console.log(templates_obj);
            templates_obj.templates= dataFromChild.templates;                     // update the name property, assign a new value                 
            return templates_obj ;                                 // return new object jasper object
            })
        }
    }
    

  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        var host = 'localhost'
        var apiBaseUrl = '/api/data/list_all_clients/';
        var apiBasePort = '5000';
        const result = await axios({
            url: 'http://localhost:5000'+apiBaseUrl,
          });
          if(result.status === 200){
            console.log("Status is 200")
            setClients(result.data);
            console.log(result.data);
        }
        const result2 = await axios({
            url: 'http://localhost:5000/api/templates/view_list/',
        }).then(function(response){
            setTemplates(response.data);
        })
      };
        fetchData();
  },[]);
  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      axios.post("http://localhost:5000/api/data/bulk/", selected)
      .then(function(response){
        setSuccess(true);
        setLoading(false);
      })
    }
  };
  return (
    <div className={classes.root}>
      <div className={classes.content}>
          <Typography variant="h1">Bulk Filling </Typography>
          <Typography variant="body">Choose the templates and clients and click on GENERATE</Typography>
          <Divider />
          <br></br>
          <Grid container>
              <Grid
              lg={5}
              className={classes.table}
              >
                  <TemplatesTable templates={templates} callbackFromParent={bulkCallback} />
                 
              </Grid>
              <Grid
              lg={5}
              className={classes.table}
              >
                <ClientsTable clients={clients} callbackFromParent={bulkCallback} />   
              </Grid>
          </Grid>
          <div className={classes.wrapper}>
          <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Generate
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Button>
        
        </div>
        {success && <SuccessBar open={success} />}
      </div>
    </div>
  );
};

export default BulkGenerate;
