import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 450
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

const ClientsTable = props => {
  const { className, clients, ...rest } = props;

  const classes = useStyles();

  const [selectedClients, setSelectedClients] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { clients } = props;

    let selectedClients;

    if (event.target.checked) {
      selectedClients = clients.map(client => client._id);
    } else {
      selectedClients = [];
    }

    setSelectedClients(selectedClients);
    props.callbackFromParent({clients: selectedClients});
  };

  const handleSelectOne = (event, _id) => {
    const selectedIndex = selectedClients.indexOf(_id);
    let newSelectedClients = [];

    if (selectedIndex === -1) {
      newSelectedClients = newSelectedClients.concat(selectedClients, _id);
    } else if (selectedIndex === 0) {
      newSelectedClients = newSelectedClients.concat(selectedClients.slice(1));
    } else if (selectedIndex === selectedClients.length - 1) {
      newSelectedClients = newSelectedClients.concat(selectedClients.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedClients = newSelectedClients.concat(
        selectedClients.slice(0, selectedIndex),
        selectedClients.slice(selectedIndex + 1)
      );
    }

    setSelectedClients(newSelectedClients);
    props.callbackFromParent({clients: newSelectedClients});
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClients.length === clients.length}
                      color="primary"
                      indeterminate={
                        selectedClients.length > 0 &&
                        selectedClients.length < clients.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Client Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.slice(0, rowsPerPage).map(client => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={client._id}
                    selected={selectedClients.indexOf(client._id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedClients.indexOf(client._id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, client._id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>{client._id}</TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{client.jmf_client_name}</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

ClientsTable.propTypes = {
  className: PropTypes.string,
  clients: PropTypes.array.isRequired
};

export default ClientsTable;
