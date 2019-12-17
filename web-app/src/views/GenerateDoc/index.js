import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Divider } from '@material-ui/core';
import { FilePond } from 'react-filepond';
import { ClientTable } from './components';
import 'filepond/dist/filepond.min.css';
import axios from 'axios';

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
    const [clients, setClients] = useState([]);
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
              <FilePond 
              allowMultiple={true} 
              server={`http://localhost:5000/api/data/upload?tempn=${props.location.state.templateName}`}
              name="data"/>
              
            </div>
          </Grid>
        </Grid>
        <Divider/>
        <ClientTable client={clients} templateName={props.location.state.templateName} />
      </div>
    );
  };

export default GenerateDoc;
