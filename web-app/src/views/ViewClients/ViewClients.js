import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import { ClientsTable } from './components';
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

const ViewClients = () => {
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
          <ClientsTable clients={clients} />   
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewClients;
