import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import UpdateIcon from '@material-ui/icons/Update'
import Divider from '@material-ui/core/Divider'
import Create from '@material-ui/icons/CreateRounded'

import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  link: { color: '#3f51b5', textDecoration: 'none' },
  card: {
    margin: theme.spacing(2),
  },
  title: { padding: theme.spacing(2) },
  list: {},
}))

const AdminDashboard = () => {
  const classes = useStyles()

  const {
    user: { _id, name, email, role },
  } = isAuthenticated()

  const adminLinks = () => {
    return (
      <div className={classes.card}>
        <div className={classes.title}>
          <Typography variant='h6'>Admin Links</Typography>
        </div>
        <div className={classes.list}>
          <List>
            <Divider />
            <Link className={classes.link} to='/create/category'>
              <ListItem>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary='Create category' />
              </ListItem>
            </Link>
            <Divider />
            <Link className={classes.link} to='/create/product'>
              <ListItem>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary='Create product' />
              </ListItem>
            </Link>
            <Divider />
            <Link className={classes.link} to='/admin/orders'>
              <ListItem>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary='View Orders' />
              </ListItem>
            </Link>
            <Divider />
            <Link className={classes.link} to='/admin/products'>
              <ListItem>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary='Manage Products' />
              </ListItem>
            </Link>
            <Divider />
            <Link className={classes.link} to='/admin/categories'>
              <ListItem>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary='Manage Categories' />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </div>
      </div>
    )
  }

  const adminInfo = () => {
    return (
      <div className={classes.card}>
        <div className={classes.title}>
          <Typography variant='h6'>Admin Information</Typography>
        </div>
        <div className={classes.list}>
          <List>
            <Divider />
            <ListItem>
              <ListItemText primary={name} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={email} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={role === 1 ? 'Admin' : 'Registered User'}
              />
            </ListItem>
            <Divider />
          </List>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Layout title='Admin Dashboard' description={`G'day ${name}!`}>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth='sm'>
            <div className='row'>
              <div className='col-3'>{adminLinks()}</div>
              <div className='col-9'>{adminInfo()}</div>
            </div>
          </Container>
        </React.Fragment>
      </Layout>
    </div>
  )
}

export default AdminDashboard
