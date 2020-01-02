import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { FilePond } from 'react-filepond';
import 
    { Grid, 
        Typography ,
        InputLabel,
        Select,
        MenuItem,
        Button,
        Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        TextField,
        DialogTitle
    } from '@material-ui/core';
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
  selectDiv:{
    marginTop : 15
  },
  select:{
      width: 300,
  },
  dialog: {
    width: 700
  },
  button:{
      marginRight: 30,
      marginTop: 30
  }
}));

const AddMapping = (props) => {
  const classes = useStyles();
  const [mapping, setMapping] = React.useState('');
  const [mappingData, setMappingData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleChange = event => {
    setMapping(event.target.value);
    console.log(event.target.value);
  };
  const handleMappingSave = function(){
      props.setMappingSelected(true, mapping);

  }
  const handleUploadStuff = function(){
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    

  }, []);

  return (
    <div>
     <Typography variant="h1">
      Please select a mapping or upload a mapping
      </Typography>
      <Grid
        container
        spacing={4}
        className={classes.selectDiv}
      >
        <Grid
          item
          lg={12}
          xs={12}
        >
            <InputLabel id ="mapping-label">Mapping ID</InputLabel>
                <Select
                labelId="mapping-label"
                id="mapping-select"
                value={mapping}
                onChange={handleChange}
                autoWidth = {true}
                className={classes.select}
                >
                
                {props.mappingArr.map(mapping =>(
                    <MenuItem value={mapping._id}>{mapping._id}</MenuItem>
                ))}
                </Select>
                
        </Grid>
      </Grid>
      <Button
                variant="outlined"
                color="primary"
                onClick={handleUploadStuff}
                className={classes.button}
                >Upload a Mapping in JSON</Button>
                
      <Button
                variant="contained"
                color="primary"
                onClick={handleMappingSave}
                className={classes.button}
                >Save</Button>
    <Grid
        container
        spacing={4}
        className={classes.dialog}
      >
        <Grid
          item
          lg={12}
        >
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Upload JSON here</DialogTitle>
        <DialogContent>

          <FilePond server={"http://localhost:5000/api/mapping/upload/"} name="mapping"
          onprocessfile={(error, file) => {
            console.log(file.serverId);
            console.log(JSON.parse(file.serverId)["mapping_id"])
            setMapping(JSON.parse(file.serverId)["mapping_id"]);
            setOpen(false);
          }}
          
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
      </Grid>
      <Grid
        container
        spacing={4}
        className={classes.dialog}
      >
        <Grid
          item
          lg={12}
        >
        </Grid>
        </Grid>
    </div>
  );
};

export default AddMapping;
