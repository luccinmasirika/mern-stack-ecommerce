import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import clsx from 'clsx'
import { Link, Redirect } from 'react-router-dom'
import { read, update, updateUser } from './apiUser'
import {
  Button,
  CardContent,
  Divider,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import CardMaterial from '@material-ui/core/Card'

const useStyles = makeStyles((theme) => ({
  margin: { margin: theme.spacing(1) },
  textField: { width: '36ch' },
  btn: { height: '6ch' },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(3),
  },
}))

const Profile = ({ match }) => {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
  })

  const { token } = isAuthenticated()
  const { name, email, password, error, success } = values

  const init = (userId) => {
    // console.log(userId);
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true })
      } else {
        setValues({ ...values, name: data.name, email: data.email })
      }
    })
  }

  useEffect(() => {
    init(match.params.userId)
  }, [])

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value })
  }

  const clickSubmit = (e) => {
    e.preventDefault()
    update(match.params.userId, token, { name, email, password }).then(
      (data) => {
        if (data.error) {
          // console.log(data.error);
          alert(data.error)
        } else {
          updateUser(data, () => {
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            })
          })
        }
      }
    )
  }

  const redirectUser = (success) => {
    if (success) {
      return <Redirect to='/cart' />
    }
  }

  const profileUpdate = (name, email, password) => (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={clickSubmit}
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
        <TextField
          id='password'
          label='Password'
          className={clsx(classes.margin, classes.textField)}
          variant='outlined'
          value={password}
          onChange={handleChange('password')}
        />

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

  return (
    <Layout
      title='Profile'
      description='Update your profile'
      className='container-fluid'
    >
      <CardContent>
        <Typography variant='h6' align='center' component='h2'>
          Profile update
        </Typography>
      </CardContent>
      <Divider />
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  )
}

export default Profile
