import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { Alert, AlertTitle } from '@material-ui/lab'

import Layout from '../core/Layout'
import { signup } from '../auth'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(3),
  },
  margin: { margin: theme.spacing(1) },
  textField: { width: '36ch' },
  btn: { height: '6ch' },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  link: { color: '#3f51b5', textDecoration: 'none' },
}))

const Signup = () => {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    amount: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
    loaderOpen: false,
  })


  const { name, email, password, success, error, loaderOpen } = values

  const handleChange = (prop) => (event) => {
    setValues({ ...values, error: false, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const preventDefault = (event) => {
    event.preventDefault()
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, error: false, loaderOpen: true })
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        console.log(data)
        console.log(data.error)
        setValues({ ...values, error: data.error, success: false, loaderOpen: false })
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
          loaderOpen: false
        })
      }
    })
  }
  const signupForm = () => (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <TextField
          id='name'
          label='Name'
          className={clsx(classes.margin, classes.textField)}
          variant='outlined'
          value={name}
          onChange={handleChange('name')}
        />
        <TextField
          id='email'
          label='Email'
          className={clsx(classes.margin, classes.textField)}
          variant='outlined'
          value={email}
          onChange={handleChange('email')}
        />
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant='outlined'
        >
          <InputLabel htmlFor='outlined-adornment-password'>
            Password
          </InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={values.showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={preventDefault}
                  edge='end'
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={90}
          />
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          className={clsx(classes.margin, classes.btn)}
        >
          Register
        </Button>
      </form>
    </div>
  )

  const showError = () => (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  )

  const showSuccess = () => (
    <Alert severity='success'>
      <AlertTitle>Success</AlertTitle>
      New account is created. Please —
      <strong>
        <Link to='/signin' className={classes.link}>
          Signin
        </Link>
      </strong>
    </Alert>
  )
  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loaderOpen}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Layout title='Signup' description='Signup to Buku Store'>
        {success && showSuccess()}
        {error && showError()}
        {signupForm()}
      </Layout>
    </div>
  )
}

export default Signup
