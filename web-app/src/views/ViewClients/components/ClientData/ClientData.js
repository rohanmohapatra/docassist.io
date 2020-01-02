import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
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
  },
  json:{
      width: 400
  }
}));

const ClientData = (props) => {
  const classes = useStyles();
  const [clientData, setClientData] = useState({});
  const handleChange = event => {
    //event.persist();
    console.log(event.target.value)
    setClientData(event.target.value);
  }
  useEffect(() => {
    setClientData(JSON.stringify(props.clientData, null, 2));
    console.log(props.clientData);
  },[props.clientData]);
  function handleUpdate(){
    //var data = {filename : self.state.documentName+'.docx', html: self.state.html}
    var data = JSON.parse(clientData);
    axios.post("http://localhost:5000/api/data/update/"+data._id+"/",data)
    .then(function(response){
        if(response.status == 200){
          props.setState("success");
          //this.setState({savestate:"none"})
          setTimeout(
            function(){
              props.setState("none");
    
            },
            3000
          )
    }
    })
    .catch(function(error){
        props.setState("error");
          //this.setState({savestate:"none"})
          setTimeout(
            function(){
              props.setState("none");
    
            },
            3000
          )
    })
}

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
           <TextField
          id="outlined-multiline-static"
          fullWidth
          label="Client Data"
          name="client_data"
          multiline
          rows="10"
          onChange={handleChange}
          value={clientData}
          variant="outlined"
          className={classes.json}
        />
         <Button variant="contained" color="primary" className={classes.button} onClick={handleUpdate}>
              Update
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ClientData;
