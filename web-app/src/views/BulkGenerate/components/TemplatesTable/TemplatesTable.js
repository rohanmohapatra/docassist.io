import React, { useState } from 'react';
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

const TemplatesTable = props => {
  const { className, templates, ...rest } = props;

  const classes = useStyles();

  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { templates } = props;

    let selectedTemplates;

    if (event.target.checked) {
      selectedTemplates = templates.map(template => template._id);
    } else {
      selectedTemplates = [];
    }

    setSelectedTemplates(selectedTemplates);
    props.callbackFromParent({templates: selectedTemplates});
  };

  const handleSelectOne = (event, _id) => {
    const selectedIndex = selectedTemplates.indexOf(_id);
    let newSelectedTemplates = [];

    if (selectedIndex === -1) {
      newSelectedTemplates = newSelectedTemplates.concat(selectedTemplates, _id);
    } else if (selectedIndex === 0) {
      newSelectedTemplates = newSelectedTemplates.concat(selectedTemplates.slice(1));
    } else if (selectedIndex === selectedTemplates.length - 1) {
      newSelectedTemplates = newSelectedTemplates.concat(selectedTemplates.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTemplates = newSelectedTemplates.concat(
        selectedTemplates.slice(0, selectedIndex),
        selectedTemplates.slice(selectedIndex + 1)
      );
    }

    setSelectedTemplates(newSelectedTemplates);
    props.callbackFromParent({templates: newSelectedTemplates});
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
                      checked={selectedTemplates.length === templates.length}
                      color="primary"
                      indeterminate={
                        selectedTemplates.length > 0 &&
                        selectedTemplates.length < templates.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Template ID</TableCell>
                  <TableCell>Template Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.slice(0, rowsPerPage).map(template => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={template._id}
                    selected={selectedTemplates.indexOf(template._id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedTemplates.indexOf(template._id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, template._id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>{template._id}</TableCell>
                    <TableCell>{template.filename}</TableCell>
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
          count={templates.length}
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

TemplatesTable.propTypes = {
  className: PropTypes.string,
  templates: PropTypes.array.isRequired
};

export default TemplatesTable;
