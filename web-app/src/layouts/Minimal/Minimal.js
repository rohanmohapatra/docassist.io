import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';

import { Topbar } from './components';
import { NavBar } from '../../components';

const useStyles = ({
  root: {
    paddingTop: 64,
    height: '100%'
  },
  content: {
    height: '100%'
  }
});

class Minimal extends Component {
  constructor(props){
    super(props);
    this.children = props.children;
    console.log(props);
  }

  render() {
    console.log(this.props);
    const classes = this.props.classes;
    console.log(classes);
    return(      
    <div className={classes.root}>
      <NavBar />
      <main className={classes.content}>{this.children}</main>
    </div>
    )}
}

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};


export default withStyles(useStyles)(Minimal);
