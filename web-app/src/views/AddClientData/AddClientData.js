import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Grid, Typography, Link, TextField, Button } from '@material-ui/core';
import { FilePond } from 'react-filepond';
import validator from 'validator';
import 'filepond/dist/filepond.min.css';
import {  SuccessBar, ErrorBar, AddMapping } from './components';
import axios from 'axios';

const schema = {
  subject: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  body: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 1024
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
};
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 80,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const AddClientData = () => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [savestate, setSaveState] = useState("none");
  const [mappingArr, setMappingArr] = React.useState([]);
  const [mappingSelected, setMappingSelected] = useState(false);
  const [mappingId, setMappingId] = useState('');
  useEffect(() => {
    const errors = validator.isJSON(formState.values.client_data + '')
    console.log(errors);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    axios.get("http://localhost:5000/api/mapping/list_all_mappings/")
    .then(function(response){
        setMappingArr(response.data);
    })

  }, []);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };
  const callbackParent = function(mappingSelected, mappingId){
    setMappingSelected(mappingSelected);
    setMappingId(mappingId);
  }

  const hasError = function(field){
    console.log(field);
    console.log(validator.isJSON(formState.values[field]+''))
    return formState.touched[field] && !validator.isJSON(formState.values[field]) ? true : false;
  }
  function handleSave(){
    //var data = {filename : self.state.documentName+'.docx', html: self.state.html}
    console.log(formState.values.client_data)
    var data = JSON.parse(formState.values.client_data)
    axios.post("http://localhost:5000/api/data/upload/"+mappingId+"/",data)
    .then(function(response){
        if(response.status == 200){
          setSaveState("success");
          //this.setState({savestate:"none"})
          setTimeout(
            function(){
              setSaveState("none");
    
            },
            3000
          )
        }
    })
    .catch(function(error){
      console.log(error);
      setSaveState("error");
      setTimeout(
        function(){
          setSaveState("none");

        },
        3000
      )
    })
}
  return (
    <div className={classes.root}>
     {!mappingSelected &&  <AddMapping mappingArr={mappingArr} setMappingSelected={callbackParent}/>}
     {mappingSelected && 
     <div><Typography variant="h1">
      Hello UserA, choose to upload a JSON file or type in client data.
      </Typography>
      <Grid
        container
        justify="center"
        spacing={1}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <Typography variant="h1">
              Upload a JSON file
            </Typography>
            <Typography variant="subtitle2">
              Add a client by uploading a JSON
            </Typography>
            <FilePond allowMultiple={true} server={"http://localhost:5000/api/data/upload/"+mappingId+"/"} name="data"/>
          </div>
        </Grid>
      </Grid>
      <Grid
        container
        justify = "center"
        spacing={2}
      >
        
        <Grid item
        lg = {8}
        >
          <div className={classes.content}>
            <Typography variant="h1">
              Type in Client Data
            </Typography>
            <Typography variant="subtitle2">
              Add a client by typing in JSON format
            </Typography>
          </div>
          <TextField
          id="outlined-multiline-static"
          error={hasError('client_data')}
          fullWidth
          helperText={
            hasError('client_data') ? "Data entered is not JSON" : null
          }
          label="JSON Data"
          name="client_data"
          multiline
          rows="6"
          defaultValue="Default Value"
          onChange={handleChange}
          value={formState.values.client_data || ''}
          variant="outlined"
        />
         <Button variant="contained" color="primary" className={classes.button} onClick={handleSave}>
              Add
          </Button>
          <SuccessBar open={savestate} />
          <ErrorBar open={savestate} message="Error during Save!"/>
        </Grid>  
      </Grid></div>}
    </div>
  );
};

export default AddClientData;
