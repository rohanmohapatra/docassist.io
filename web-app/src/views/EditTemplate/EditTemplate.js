import React,{useEffect, useState, Component} from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid, Typography, Button, IconButton, CircularProgress } from '@material-ui/core';
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

}));
class EditTemplate extends Component{
  constructor(props){
    super(props);
    this.state = {
      html : "",
      status: false,
      savestate: "none"
    }
    this.myCallback = this.myCallback.bind(this);
    this.handleBack = this.handleBack.bind(this);
    const {text, match: {params}} = this.props;
    this.name = params.template_id;
    this.history = props.history;
   

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
      
      var apiBaseUrl = '/api/templates/'+this.name+'/edit/';
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
  

  render() {
    
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div className={classes.contentHeader}>
              <IconButton onClick={this.handleBack}>
                <ArrowBackIcon />
              </IconButton>
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
            
            {this.state.status &&<Editor placeholder={'Write something...'} editedHtml={this.state.html} callbackFromParent={this.myCallback} templateId={this.name}/>}
            
            <SuccessBar open={this.state.savestate} />
            <ErrorBar open={this.state.savestate} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(EditTemplate);
