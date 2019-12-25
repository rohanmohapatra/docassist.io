import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Divider } from '@material-ui/core';
import { FilePond } from 'react-filepond';
import { ClientTable, SuccessBar } from './components';
import 'filepond/dist/filepond.min.css';
import axios from 'axios';

import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

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
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    fileContainer:{
      marginBottom : 60
    }
  }));
  
  const GenerateDoc = props => {
    const classes = useStyles();
    const [clients, setClients] = useState([]);
    const [status, setStatus] = useState(false);
    const [clientId, setClientId] = useState({});
    const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [files, setFiles] = useState([]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
    //const [pond, setPond] = useState([]);
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
        };
          fetchData();
    },[]);
    const handleButtonClick = () => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
        //var data = {template_name: props.location.state.templateName, client_id: JSON.parse(clientId).client_id};
        console.log(data)
        for(var i=0;i< files.length;i++){
          var data = {template_name: props.location.state.templateName, client_id: JSON.parse(files[i].serverId).client_id};
          axios.post("http://localhost:5000/api/generate/", data)
          .then(function(response){
            console.log(response);
            setSuccess(true);
            setLoading(false);
          })
        }
        setFiles([]);
        
      }
    };
    return (
      <div className={classes.root}>
        {success && <SuccessBar open={success} />}
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={6}
            xs={12}
            className = {classes.fileContainer}
          >
            <div className={classes.content}>
              <Typography variant="h1">
                Upload Data
              </Typography>
              <Typography variant="subtitle2">
                Upload data for {props.location.state.templateName} template.
              </Typography>
              <FilePond 
              allowMultiple={true} 
              onprocessfile={(error, file) => {
                setStatus(true)
                setClientId(file.serverId)
                setFiles(prevState => {
                  let files = Object.assign([], prevState);  // creating copy of state variable jasper
                  console.log(files);
                  files.push(file);                    // update the name property, assign a new value    
                  console.log(files);             
                  return files ;                                 // return new object jasper object
                  })
            }}
              onremovefile = {(file) => {
                setStatus(false);
                setSuccess(true);
                setLoading(false);
              }
              }
              server={`http://localhost:5000/api/data/upload/`}
              name="data"/>
              
             
            </div>
            {status &&
              <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleButtonClick}
            >
              Generate
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>}
          </Grid>
        </Grid>
        <Divider/>
        <ClientTable client={clients} templateName={props.location.state.templateName} />
      </div>
    );
  };

export default GenerateDoc;
