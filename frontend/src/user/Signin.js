import React from 'react'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
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
import { signin, authenticate, isAuthenticated } from '../auth'

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
  textField: { width: '36ch' },
  btn: { height: '6ch' },
}))

const Signin = () => {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    amount: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    email: 'luccinmasirika@gmail.com',
    password: 'password243',
    error: '',
    loaderOpen: false,
    redirectToReferrer: false,
  })

  const [open, setOpen] = React.useState(false)

  const { email, password, loaderOpen, error, redirectToReferrer } = values

  const { user } = isAuthenticated()

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
    setOpen(!open)
    setValues({ ...values, error: false, loaderOpen: true })
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loaderOpen: false })
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
            loaderOpen: false,
          })
        })
      }
    })
  }

  const signinForm = () => (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
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
          Login
        </Button>
      </form>
      {/* <Typography
        variant='subtitle1'
        style={{ fontFamily: 'roboto', margin: 5 }}
      >
        <Link href='#' onClick={preventDefault}>
          Forgot your password ?
        </Link>
      </Typography> */}
    </div>
  )

  const showError = () => (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  )

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to='/admin/dashboard' />
      } else {
        return <Redirect to='/user/dashboard' />
      }
    }
    if (isAuthenticated()) {
      return <Redirect to='/' />
    }
  }

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loaderOpen}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Layout title='Signin' description='Signin to Buku Store'>
        {error && showError()}
        {signinForm()}
        {redirectUser()}
      </Layout>
    </div>
  )
}

export default Signin
