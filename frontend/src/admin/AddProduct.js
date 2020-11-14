import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Alert, AlertTitle } from '@material-ui/lab'

import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { createProduct, getCategories } from './apiAdmin'
import { Container, CssBaseline, MenuItem, Select } from '@material-ui/core'

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
  formControl: {
    maxWidth: '35ch',
  },
}))

const AddProduct = () => {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: '',
    quantity: '',
    photo: '',
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: '',
    loader: false,
    success: false,
  })

  const { user, token } = isAuthenticated()
  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loader,
    error,
    photo,
    createdProduct,
    redirectToProfile,
    formData,
    success,
  } = values

  // load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({
          ...values,
          categories: data,
          formData: new FormData(),
        })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    formData.set(name, value)
    setValues({ ...values, success: false, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, error: '', success: false, loader: true })

    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          loader: false,
          error: data.error,
        })
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          quantity: '',
          loader: false,
          success: true,
          createdProduct: data.name,
        })
      }
    })
  }

  const newPostForm = () => (
    <form
      noValidate
      autoComplete='off'
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <label htmlFor='upload-photo'>
        <input
          style={{ display: 'none' }}
          id='upload-photo'
          name='upload-photo'
          type='file'
          accept='image/*'
        />

        <Button
          color='secondary'
          variant='contained'
          component='span'
          className={clsx(classes.margin, classes.btn)}
        >
          <AddAPhotoIcon />
          Upload post image
        </Button>
      </label>
      <TextField
        id='name'
        label='Name'
        className={clsx(classes.margin, classes.textField)}
        variant='outlined'
        value={name}
        onChange={handleChange('name')}
      />
      <TextField
        id='description'
        label='Description'
        className={clsx(classes.margin, classes.textField)}
        variant='outlined'
        value={description}
        onChange={handleChange('description')}
      />
      <TextField
        id='price'
        label='Price'
        className={clsx(classes.margin, classes.textField)}
        variant='outlined'
        value={price}
        onChange={handleChange('price')}
      />
      <FormControl
        variant='outlined'
        className={clsx(classes.margin, classes.textField)}
      >
        <InputLabel id='demo-simple-select-outlined-label'>Category</InputLabel>
        <Select
          labelId='select-category'
          id='category'
          value={category}
          onChange={handleChange('category')}
          label='Category'
        >
          <MenuItem value=''>
            <em>Please select a category</em>
          </MenuItem>
          {categories &&
            categories.map((c, i) => (
              <MenuItem key={i} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl
        variant='outlined'
        className={clsx(classes.margin, classes.textField)}
      >
        <InputLabel id='demo-simple-select-outlined-label'>Shipping</InputLabel>
        <Select
          labelId='select-category'
          id='category'
          value={shipping}
          onChange={handleChange('shipping')}
          label='Shipping'
        >
          <MenuItem value=''>
            <em>Please select</em>
          </MenuItem>
          <MenuItem value={0}>No</MenuItem>
          <MenuItem value={1}>Yes</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id='quantity'
        label='Quantity'
        className={clsx(classes.margin, classes.textField)}
        variant='outlined'
        value={quantity}
        onChange={handleChange('quantity')}
      />
      <Button
        variant='contained'
        color='primary'
        type='submit'
        className={clsx(classes.margin, classes.btn)}
      >
        Create Product
      </Button>
    </form>
  )

  const showSuccess = () => (
    <Alert severity='success'>
      <AlertTitle>Success</AlertTitle>
      {`${createdProduct}`} is created
    </Alert>
  )

  const showError = () => (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  )

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loader}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Layout
        title='Add a new product'
        description={`Hay ${user.name}! Ready to add a new product?`}
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
            {newPostForm()}
          </Container>
        </React.Fragment>
      </Layout>
    </div>
  )
}

export default AddProduct
