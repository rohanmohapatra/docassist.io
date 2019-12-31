import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import { SuccessBar } from '..';
import CodeIcon from '@material-ui/icons/Code';

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

  }));

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const CustomButton = () => <span className="octicon octicon-star" />;

/*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}

function insertJinjaTag() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "{{}}");

  this.quill.setSelection(cursorPosition+3);
}

function insertPageBreak() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "{{page_break}}");
  this.quill.setSelection(cursorPosition + 14);
}
/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <button className="ql-insertJinjaTag">
      <CodeIcon />
    </button>
    <button className="ql-insertPageBreak">
        ¶
    </button>
  </div>
);


class Editor extends React.Component {
    constructor (props) {
      super(props);
      this.state = { editorHtml: props.editedHtml, theme: 'snow', savestate: "none"}
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange (html) {
        this.setState({ editorHtml: html });
      //console.log(this.state.editorHtml);
      this.props.sendHtmlToParent(html);
    }
    

    
    render () {
    const classes = this.props.classes;
      return (
        <div>
          <CustomToolbar />
          <ReactQuill 
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.editorHtml}
            modules={Editor.modules}
            formats={Editor.formats}
            bounds={classes.app}
            placeholder={this.props.placeholder}
           />
         </div>
       )
    }
  }
  
  /* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  Editor.modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertStar: insertStar,
        insertJinjaTag: insertJinjaTag,
        insertPageBreak : insertPageBreak
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color"
  ];
  
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