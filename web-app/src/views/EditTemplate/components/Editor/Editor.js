import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import { SuccessBar } from '..';

const styles = (theme => ({
    "body": {
      "background": "#f3f1f2",
      "fontFamily": "sans-serif"
    },
    "app": {
      "margin": "1rem 4rem"
    },
    "app__ql_container": {
      "borderBottomLeftRadius": "0.5em",
      "borderBottomRightRadius": "0.5em",
      "background": "#fefcfc"
    },
    "app__ql_snow_ql_toolbar": {
      "display": "block",
      "background": "#eaecec",
      "borderTopLeftRadius": "0.5em",
      "borderTopRightRadius": "0.5em"
    },
    "app__ql_bubble__ql_editor": {
      "border": "1px solid #ccc",
      "borderRadius": "0.5em"
    },
    "app__ql_editor": {
      "minHeight": "18em"
    },
    "themeSwitcher": {
      "marginTop": "0.5em",
      "fontSize": "small"
    },
    button: {
      margin: theme.spacing(1),
    },

  }));
class Editor extends React.Component {
    constructor (props) {
      super(props);
      this.state = { editorHtml: props.editedHtml, theme: 'snow', savestate: "none"}
      this.handleChange = this.handleChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
    }
    handleChange (html) {
        this.setState({ editorHtml: html });
      //console.log(this.state.editorHtml);
    }
    handleSave(){
      const submitData = async() => {
        var apiBaseUrl = '/api/templates/'+this.props.templateId+'/save/';
        var data = {
          html : this.state.editorHtml
        }
        const result = await axios({
          url: 'http://localhost:5000'+apiBaseUrl,
          method : 'post',
          data : data,
  
        })
        .then(response => {
          if(response.status == 200){
            this.props.callbackFromParent("success");
            //this.setState({savestate: "success"});
          }
          else{
            
            //this.setState({savestate: "error"});
          }
        }
        )
        .catch(error => {
          this.props.callbackFromParent("error");
        });
        
      }
      submitData();
    }
    
    handleThemeChange (newTheme) {
      if (newTheme === "core") newTheme = null;
      this.setState({ theme: newTheme })
    }
    
    render () {
    const classes = this.props.classes;
      return (
        <div>
          <ReactQuill 
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.editorHtml}
            modules={Editor.modules}
            formats={Editor.formats}
            bounds={classes.app}
            placeholder={this.props.placeholder}
           />
           <Button variant="outlined" color="secondary" className={classes.button} href="/home">
                Cancel
            </Button>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSave}>
                Save
            </Button>
         </div>
       )
    }
  }
  
  /* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  Editor.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
  
  /* 
   * PropType validation
   */
  Editor.propTypes = {
    placeholder: PropTypes.string,
    editedHtml: PropTypes.string,
    templateId: PropTypes.string
  }

  export default withStyles(styles)(Editor);
  
  /* 
   * Render component on page
   
  ReactDOM.render(
    <Editor placeholder={'Write something...'}/>, 
    document.querySelector('.app')
  )
  */