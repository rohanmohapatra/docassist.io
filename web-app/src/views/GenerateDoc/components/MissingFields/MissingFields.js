import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { 
    Grid, 
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    InputLabel,
    Select,
    MenuItem

 } from '@material-ui/core';
import axios from 'axios';
import { func } from 'prop-types';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

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
  select: {
      width: 150,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const MissingFields = (props) => {
  const classes = useStyles();
  const [missingFields, setMissingFields] = React.useState(props.missingFields);
  const [mappingId, setMappingId] = React.useState('');
  const [open, setOpen] = React.useState(props.openDialog);
  const [clientData, setClientData] = React.useState(props.clientData);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const handleChange = (client_field, template_field) => {
    setMissingFields(missingField => ({
        ...missingField,
        [template_field]: client_field

      }));
  };
  const handleClose = () => {
    setOpen(false);
    props.onClose(false);
    
  };

  const handleSave = () => {
    console.log(missingFields);
    if (!loading) {
        setSuccess(false);
        setLoading(true);
    axios.post("http://localhost:5000/api/mapping/update/"+mappingId+"/", missingFields)
    .then(function(response){
        setSuccess(true);
        setLoading(false);
        setTimeout(function(){var i; i++;},3000);
        setOpen(false);
        props.onClose(false, true, clientData);
    })

    }
  
};
  React.useEffect(() => {
    setOpen(props.openDialog);
    setMappingId(props.clientData['mapping_id'])
    delete props.clientData['mapping_id']
    setClientData(props.clientData);
    setMissingFields(props.missingFields);
    console.log(props.clientData);
  },[props.openDialog]);
  return (
    <div className={classes.root}>
       <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Missing Fields</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We found these fields are missing during Generate, please provide client mapping for the template field.
          </DialogContentText>
          {Object.keys(missingFields).map(template_field => (
              <div>
                  <Typography variant="h3">
                  {template_field}
                  {console.log(missingFields[template_field])}
                   </Typography>
                   <InputLabel id ="mapping-label">Client Mapping Field</InputLabel>
                <Select
                labelId="mapping-label"
                id="mapping-select"
                value={missingFields[template_field]}
                onChange={(event) => handleChange(event.target.value, template_field)}
                autoWidth = {true}
                className={classes.select}
                >
                
                {Object.keys(clientData).slice(1,clientData.length).map(client_field =>(
                    <MenuItem value={client_field} >{client_field}</MenuItem>
                ))}
                </Select>
              </div>
              
              
        ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
              <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleSave}
            >
              Save & Continue
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MissingFields;
