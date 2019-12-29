import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  CircularProgress
} from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BuildIcon from '@material-ui/icons/Build';
import IconButton from '@material-ui/core/IconButton';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import EmailIcon from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 200,
    width: 200,
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  filename:{
    marginTop: 10,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18
  },
  version:{
    fontFamily: 'Montserrat',
    fontWeight: 300,
    fontSize: 15
  },
  verified:{
    color : theme.palette.primary.main,
    fontSize: 15
    },
  pdf: {
    color : '#F02201',
  },
  docx:{
    color : '#537EC0',
  },
  email:{
    color: '#F05826'
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
}));

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

const TemplateCard = props => {
  const { className, template,emailAddress, ...rest } = props;

  const classes = useStyles();
  const [docStatus, setDocStatus] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  
  useEffect(() => {
    const errors = validate(formState.values, schema);
    console.log(template);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    
    var estream = new EventSource("http://localhost:5000/api/media/"+template.id+"/status/");
    estream.onmessage = function(event){
      var status = event.data.split(';')[0];
      template.filename = event.data.split(';')[1];
      if(status == "generating")
        setDocStatus(false);
      else if (status == "done"){
        setDocStatus(true);
        estream.close();
      }
       
    }


  }, [formState.values]);

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

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;
  const [open, setOpen] = React.useState(false);
  const handleEmail = function(){
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = event => {
    event.preventDefault();
    console.log(formState);
    var pdfLink = template.pdfLink.split("/")
    console.log(pdfLink[pdfLink.length - 1])
    var pdfName = pdfLink[pdfLink.length - 1]
    axios.post("http://localhost:5000/api/email/send/"+pdfName, formState.values)
    .then(function(response){
      console.log(response.status);
    })
    props.callback(true);
    setOpen(false);

  }
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.imageContainer}>
          <img
            alt="template"
            className={classes.image}
            src='/images/static/google_docs.png'
          />
        </div>
        <Typography
          align="left"
          gutterBottom
          variant="h4"
          className={classes.filename}
        >
          {template.filename} <VerifiedUserIcon className={classes.verified} />
        </Typography>
       
        <Typography
          align="left"
          gutterBottom
          variant="body"
          component="p"
          className={classes.version}
        >
          Created: {(new Date(template.createdTime*1000)).toString()}
        </Typography>
        
      </CardContent>
      <Divider />
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Grid
            className={classes.statsItem}
            item
          >
            {!docStatus && <Typography display="inline" variant="body2"
            >Please Wait.. <CircularProgress size={24}/></Typography>}
            {docStatus &&
            <Typography
              display="inline"
              variant="body2"
            >
              <IconButton href={template.pdfLink}>
                <PictureAsPdfIcon className={classes.pdf}/>
              </IconButton>
              <IconButton href={template.docLink}>
                <DescriptionIcon className={classes.docx}/>
              </IconButton>
              <IconButton onClick={handleEmail}>
                <EmailIcon className={classes.email}/>
              </IconButton>
              <IconButton href={"/document/edit/"+template.id}>
                <EditIcon />
              </IconButton>
              
            </Typography>
            }
          </Grid>
        </Grid>
      </CardActions>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Compose</DialogTitle>
        <DialogContent>
        <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSend}
              >
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('subject')}
                  fullWidth
                  helperText={
                    hasError('subject') ? formState.errors.subject[0] : null
                  }
                  label="Subject"
                  name="subject"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.subject || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('body')}
                  fullWidth
                  helperText={
                    hasError('body') ? formState.errors.body[0] : null
                  }
                  label="Body"
                  name="body"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.body || ''}
                  variant="outlined"
                  multiline = {true}                />
                <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  type="submit"
                  variant="contained"
                >
                  Send
                </Button>
              </form>
            </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

TemplateCard.propTypes = {
  className: PropTypes.string,
  template: PropTypes.object.isRequired,
};

export default TemplateCard;
