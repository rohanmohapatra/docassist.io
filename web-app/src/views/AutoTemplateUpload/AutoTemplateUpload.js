import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Grid, Typography, Link } from '@material-ui/core';
import { FilePond } from 'react-filepond';
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
  buttonGrid:{
    position: 'relative',
    left: '65%'
  }
}));

const AutoTemplateUpload = () => {
  const classes = useStyles();
  const [fileCount, setFileCount] = useState(0);
  const [documentName, setDocumentName] = useState({document_1:'', document_2:''});
  const [loading, setLoading] = React.useState(false);
  const [fileLimit, setFileLimit] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const handleButtonClick = () => {
    if (!loading) {
      console.log(documentName);
      setSuccess(false);
      setLoading(true);
      //var data = {template_name: props.location.state.templateName, client_id: JSON.parse(clientId).client_id};
      axios.post("http://localhost:5001/api/autotemplate/generate/", documentName)
      .then(function(response){
        setSuccess(true);
        setLoading(false);
        window.location.href = "http://localhost:3000/edit/autotemplate/"+response.data["generated_document_name"];
      })
      
    }
  };
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
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
              Welcome to Auto Template Generation, Please upload 2 documents
            </Typography>
            <FilePond 
            allowMultiple={true} 
            server="http://localhost:5000/api/autotemplate/upload/" 
            name="autotemplate" 
            maxFiles={2}
            onprocessfile={(error, file) => {
              var fileC = fileCount;
              setFileCount(fileC+1);
              fileC = fileC+1;
              console.log(file.serverId)
              setDocumentName(documentName =>({
                ...documentName,
                ["document_"+fileC]: JSON.parse(file.serverId)["document_name"]
              }))
              if(fileC == 2){
                setFileLimit(true);
              }
              console.log(fileC);
              

          }}
            />
          </div>
        </Grid>
        
      </Grid>
      <Grid
        container
        justify="right"
        spacing={4}
        className={classes.buttonGrid}
      >
      <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading || !fileLimit}
              onClick={handleButtonClick}
            >
              Generate
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
            </Grid>
    </div>
    
  );
};

export default AutoTemplateUpload;
