import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Button
} from '@material-ui/core';
import axios from 'axios';
import MissingFields from '../MissingFields';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const ClientTable = props => {
  const { className, clients, templateName,  ...rest } = props;

  const classes = useStyles();
  const [generateStatus, setGenerateStatus] = useState({client_1 : "Hello", client_2 : "Bye"});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [missingFieldsDialogOpen, setOpen] = useState(false);
  const [clientData, setClientData] = useState({});
  const [missingFields, setMissingFields] = useState({});
  useEffect(() => {
      var obj = {};
      console.log("Hello");
      console.log(props.clients);
        clients.map( eachClient => (
            obj[eachClient._id] = "Service Worker Sleep"
        ));
        console.log(obj);
        setGenerateStatus(obj);
    },[props.clients]);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  function handleGenerate(client){
    console.log(client);
    //setOpen(true);
    setClientData(client);
    axios.get("http://localhost:5000/api/data/check_template_schema_compatibility/"+props.templateId+"/"+client._id+"/")
    .then(function(response){
      setMissingFields(response.data);
      if(Object.keys(response.data).length != 0)
          setOpen(true);
      else if(Object.keys(response.data).length == 0){
        var client_id = client._id;
        setOpen(false);
        setGenerateStatus(prevState => {
            let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
            console.log(client_obj);
            client_obj[client_id] = 'Generating... Please Wait';                     // update the name property, assign a new value                 
            return client_obj ;                                 // return new object jasper object
          })
          //setGenerateStatus({client_id : "Generating Data ..."});
          var data = {template_name: templateName, client_id: client_id}
          axios.post("http://localhost:5000/api/generate/", data)
          .then(function(response){
            setGenerateStatus(prevState => {
                let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
                client_obj[client_id] = 'Done';                     // update the name property, assign a new value                 
                return client_obj;                                 // return new object jasper object
              })
            console.log(generateStatus);
          })
      }
    })
    /*
    setGenerateStatus(prevState => {
        let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
        console.log(client_obj);
        client_obj[client_id] = 'Generating... Please Wait';                     // update the name property, assign a new value                 
        return client_obj ;                                 // return new object jasper object
      })
      //setGenerateStatus({client_id : "Generating Data ..."});
      var data = {template_name: templateName, client_id: client_id}
      axios.post("http://localhost:5000/api/generate/", data)
      .then(function(response){
        setGenerateStatus(prevState => {
            let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
            client_obj[client_id] = 'Done';                     // update the name property, assign a new value                 
            return client_obj;                                 // return new object jasper object
          })
        console.log(generateStatus);
      })
      */
  }
  function callbackParent(close, isReady, client){
    setOpen(close);
    if(isReady == true){
      var client_id = client._id;
    setGenerateStatus(prevState => {
        let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
        console.log(client_obj);
        client_obj[client_id] = 'Generating... Please Wait';                     // update the name property, assign a new value                 
        return client_obj ;                                 // return new object jasper object
      })
      //setGenerateStatus({client_id : "Generating Data ..."});
      var data = {template_name: templateName, client_id: client_id}
      axios.post("http://localhost:5000/api/generate/", data)
      .then(function(response){
        setGenerateStatus(prevState => {
            let client_obj = Object.assign({}, prevState);  // creating copy of state variable jasper
            client_obj[client_id] = 'Done';                     // update the name property, assign a new value                 
            return client_obj;                                 // return new object jasper object
          })
        console.log(generateStatus);
      })
    }
  }
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Generate Data</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.slice(0, rowsPerPage).map(client => (
                  
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={client._id}
                  >
                    <TableCell>{client._id}</TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{client.jmf_client_name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className={classes.nameContainer}>
                        <Button variant="outlined" color="secondary" className={classes.button} onClick={() => handleGenerate(client)}>
                            Generate
                        </Button>
                       
                        {console.log(missingFieldsDialogOpen)}
                        </div>
                        
                    </TableCell>
                    <TableCell>
                        {generateStatus[client._id]}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <MissingFields openDialog={missingFieldsDialogOpen} missingFields={missingFields} onClose={callbackParent} clientData={clientData} templateId={props.templateId}/>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={clients.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

ClientTable.propTypes = {
  className: PropTypes.string,
  client: PropTypes.array.isRequired,
  templateName: PropTypes.string.isRequired,
};

export default ClientTable;
