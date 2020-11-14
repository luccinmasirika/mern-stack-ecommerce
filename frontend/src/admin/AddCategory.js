import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Alert, AlertTitle } from '@material-ui/lab'

import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { createCategory } from './apiAdmin'
import { Container, CssBaseline } from '@material-ui/core'

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
  margin: { margin: theme.spacing(1) },
  textField: { width: '35ch' },
  btn: { width: '35ch', height: '6ch' },
  link: { color: '#fff', textDecoration: 'none' },
}))

const AddCategory = () => {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    loader: false,
  })
  const { name, error, success, loader } = values

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated()

  const handleChange = (event) => {
    setValues({
      ...values,
      error: '',
      success: false,
      name: event.target.value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, error: '', loader: true, success: false })
    // make request to api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loader: false })
      } else {
        setValues({
          ...values,
          error: '',
          loader: false,
          success: true,
        })
      }
    })
  }

  const onGoBack = () => {
    setValues({ ...values, loader: true })
    console.log(loader)
  }

  const newCategoryFom = () => (
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
        required
        onChange={handleChange}
      />
      <Button
        variant='contained'
        color='primary'
        type='submit'
        className={clsx(classes.margin, classes.btn)}
      >
        Create Category
      </Button>
    </form>
  )

  const showSuccess = () => (
    <Alert severity='success'>
      <AlertTitle>Success</AlertTitle>
      {name} is created
    </Alert>
  )

  const showError = () => (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      Category should be unique
    </Alert>
  )

  const goBack = () => (
    <Button
      variant='contained'
      color='primary'
      onClick={onGoBack}
      className={clsx(classes.margin, classes.btn)}
    >
      <Link to='/admin/dashboard' className={classes.link}>
        Back to Dashboard
      </Link>
    </Button>
  )

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loader}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Layout
        title='Add a new category'
        description={`G'day ${user.name}, ready to add a new category?`}
      >
        {success && showSuccess()}
        {error && showError()}
        <React.Fragment>
          <CssBaseline />
          <Container
            maxWidth='sm'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {newCategoryFom()}
            {goBack()}
          </Container>
        </React.Fragment>
      </Layout>
    </div>
  )
}

export default AddCategory
