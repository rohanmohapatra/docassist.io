import React,{useEffect, useState, Component} from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid, Typography, Button, IconButton, CircularProgress, TextField } from '@material-ui/core';
import { Editor, SuccessBar, ErrorBar } from './components';
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const styles = (theme => ({
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
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1),
  },
  documentName: {
    margin: theme.spacing(3),
    marginLeft: 0
  },

}));
class AutoTemplateEdit extends Component{
  constructor(props){
    super(props);
    this.state = {
      html : "",
      status: false,
      savestate: "none",
      errorMsg: "",
      documentName: ""
    }
    this.myCallback = this.myCallback.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.editorHtml = this.editorHtml.bind(this);
    this.handleDocumentNameChange = this.handleDocumentNameChange.bind(this);
    const {text, match: {params}} = this.props;
    this.name = params.template_name;
    this.history = props.history;
   

  }
  handleDocumentNameChange= function(e) {
        this.setState({
            documentName: e.target.value
        });
    }


  editorHtml = (html) => {
      this.setState({html: html});
  }
  myCallback = (dataFromChild) => {
    console.log(dataFromChild);
    if(dataFromChild == "success"){
      this.setState({savestate:"success"});
      //this.setState({savestate:"none"})
      setTimeout(
        function(){
          this.setState({savestate:"none"});

        }
        .bind(this),
        3000
      )
      console.log(this.state.savestate);
    }
    if(dataFromChild == "error"){
      this.setState({savestate:"error"});
      
      setTimeout(
        function(){
          this.setState({savestate:"none"});

        }
        .bind(this),
        3000
      )
    }
}
  handleBack(){
    this.history.goBack();
  };
  componentWillMount(){
    console.log(this.props);

    var self = this;
    const fetchData = async () => {
      var host = 'localhost'
      
      var apiBaseUrl = '/api/autotemplate/edit/'+this.name+'/';
      var apiBasePort = '5000';
      const result = await axios({
          url: 'http://localhost:5000'+apiBaseUrl,
        });
        if(result.status === 200){
          console.log("Status is 200")
          self.setState({html : result.data, status: true});
      }
    };
    fetchData();
  }
  handleSave(){
      var self = this;
      var data = {template_filename : self.state.documentName+'.docx', html: self.state.html}
      axios.post("http://localhost:5000/api/autotemplate/save/",data)
      .then(function(response){
          if(response.status == 200){
            self.setState({savestate:"success"});
            //this.setState({savestate:"none"})
            setTimeout(
              function(){
                self.setState({savestate:"none"});
      
              }
              .bind(self),
              3000
            )
            console.log(self.state.savestate);
          }
      })
      .catch(function(error){
        self.setState({savestate:"error"});
        self.setState({errorMsg : error});
        setTimeout(
          function(){
            self.setState({savestate:"none"});
  
          }
          .bind(self),
          3000
        )
      })
  }

  render() {
    
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div className={classes.contentHeader}>
              <IconButton onClick={this.handleBack}>
                <ArrowBackIcon />
              </IconButton>
              
              
            </div>
        <div className={classes.documentName}>
        <TextField id="document-name" label="Template Name" variant="outlined" value={this.state.documentName} onChange={this.handleDocumentNameChange} onBlur={(event)=> event.target.disabled= true} onClick ={(event)=> event.target.disabled= false} />
        <Typography variant="h3" style={{display: 'inline-block', marginTop: 20, marginLeft: 4}}>.docx</Typography>
        </div>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          {!this.state.status && <Typography variant="body"><CircularProgress />Please Wait...</Typography>} 
          <Grid
            item
            lg={12}
            xs={12}
          >
            
    {this.state.status &&<Editor placeholder={'Start creating Template .. '} editedHtml={this.state.html} sendHtmlToParent={this.editorHtml} templateName={this.name}/> }

          </Grid>
          <Button variant="outlined" color="secondary" className={classes.button} onClick={this.handleBack}>
                Cancel
            </Button>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSave}>
                Save
            </Button>
        </Grid>
        <SuccessBar open={this.state.savestate} />
        <ErrorBar open={this.state.savestate} message={this.state.errorMsg}/>
      </div>
    );
  }
}

export default withStyles(styles)(AutoTemplateEdit);
