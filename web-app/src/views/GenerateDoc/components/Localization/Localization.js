import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import 
    { 
        Grid, 
        Typography,
        FormControl,
        InputLabel,
        Select,
        MenuItem,
        IconButton
    } from '@material-ui/core';
    import EditIcon from '@material-ui/icons/Edit';
    import CheckCircleIcon from '@material-ui/icons/CheckCircle';
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
  currency:{
      width: 250
  },
  locale:{
      width: 170
  },
  date:{
      width: 100
  }
}));

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', ' MYR', 'JPY', 'CNY'];
const locales = ['en-US'];
const datefmts = ['DD', 'MM', 'YYYY'];

const Localization = (props) => {
  const classes = useStyles();
  const [currencyFormat, setCurrencyFormat] = useState('USD');
  const [locale, setLocale] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [dateFormat, setDateFormat] = useState({
      'first': '',
      'second' : '',
      'third' : ''
  })
  const inputLabel = React.useRef(null);
  const handleCurrency = event => {
    setCurrencyFormat(event.target.value);
  };
  const handleLocale = event => {
      setLocale(event.target.value);
  };
  const handleDateFormat = (event, field) =>{
      setDateFormat(dateFormat =>({
          ...dateFormat,
        [field]: event.target.value
      }));
      
  }
  const handleDisabled = () =>{
      setDisabled(false);
  }
  const handleSave = () => {
      setDisabled(true);
      var dateString = dateFormat.first+"/"+dateFormat.second+"/"+dateFormat.third
      props.localizationCallback(currencyFormat, locale, dateString);
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          lg={3}
          xs={12}
        >
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="currency-label">
                Currency
            </InputLabel>
            <Select
            labelId="currency-label"
            id="currency-select"
            value={currencyFormat}
            onChange={handleCurrency}
            className= {classes.currency}
            disabled ={disabled}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {currencies.map(currency => (
                 <MenuItem value={currency}>{currency}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>
        <Grid
          item
          lg={3}
          xs={12}
        >
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="locale-label">
                Locale
            </InputLabel>
            <Select
            labelId="locale-label"
            id="locale-select"
            value={locale}
            onChange={handleLocale}
            className= {classes.locale}
            disabled ={disabled}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {locales.map(loc => (
                 <MenuItem value={loc}>{loc}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>
        <Grid
          item
          lg={1}
          xs={12}
        >
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="datefirst-label">
                Date
            </InputLabel>
            <Select
            labelId="datefirst-label"
            id="datefirst-select"
            value={dateFormat.first}
            onChange={(event)=>(handleDateFormat(event, 'first'))}
            className= {classes.date}
            defaultValue = "dd"
            disabled ={disabled}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {datefmts.map(datefmt => (
                 <MenuItem value={datefmt}>{datefmt}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>
        <Grid
          item
          lg={1}
          xs={12}
        >
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="datesecond-label">
                Date
            </InputLabel>
            <Select
            labelId="datesecond-label"
            id="datesecond-select"
            value={dateFormat.second}
            onChange={(event)=>(handleDateFormat(event, 'second'))}
            className= {classes.date}
            defaultValue = "dd"
            disabled ={disabled}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {datefmts.map(datefmt => (
                 <MenuItem value={datefmt}>{datefmt}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>
        <Grid
          item
          lg={1}
          xs={12}
        >
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="datethird-label">
                Date
            </InputLabel>
            <Select
            labelId="datethird-label"
            id="datethird-select"
            value={dateFormat.third}
            onChange={(event)=>(handleDateFormat(event, 'third'))}
            className= {classes.date}
            defaultValue = "dd"
            disabled ={disabled}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {datefmts.map(datefmt => (
                 <MenuItem value={datefmt}>{datefmt}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Grid>
        <Grid
          item
          lg={1}
          xs={12}
        >
            <IconButton onClick={handleDisabled}>
                <EditIcon />
            </IconButton>
        </Grid>
        <Grid
          item
          lg={1}
          xs={12}
        >
            <IconButton onClick={handleSave}>
                <CheckCircleIcon />
            </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default Localization;
