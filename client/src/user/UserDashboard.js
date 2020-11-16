import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import UpdateIcon from '@material-ui/icons/Update'
import Divider from '@material-ui/core/Divider'
import CardContent from '@material-ui/core/CardContent'
import CardMaterial from '@material-ui/core/Card'

import Layout from '../core/Layout'
import { getPurchaseHistory } from './apiUser'
import moment from 'moment'
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
  container: { marginBottom: theme.spacing(2), background: '#fafaff' },
  list: {},
}))

const Dashboard = () => {
  const classes = useStyles()
  const [history, setHistory] = useState([])

  const {
    user: { _id, name, email, role },
  } = isAuthenticated()
  const token = isAuthenticated().token

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      console.log('bug data', data)
      if (data.error) {
        console.log(data.error)
      } else {
        setHistory(data)
      }
    })
  }

  useEffect(() => {
    init(_id, token)
  }, [])

  const userLinks = () => {
    return (
      <div className={classes.card}>
        <div className={classes.title}>
          <Typography variant='h6'>User Links</Typography>
        </div>
        <div className={classes.list}>
          <List>
            <Divider />
            <Link className={classes.link} to='/cart'>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary='My Cart' />
              </ListItem>
            </Link>
            <Divider />
            <Link className={classes.link} to={`/profile/${isAuthenticated().user._id}`}>
              <ListItem>
                <ListItemIcon>
                  <UpdateIcon />
                </ListItemIcon>
                <ListItemText primary='Update Profile' />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </div>
      </div>
    )
  }

  const userInfo = () => {
    return (
      <div className={classes.card}>
        <div className={classes.title}>
          <Typography variant='h6'>User Information</Typography>
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

  const purchaseHistory = (history) => {
    return (
      <div className={classes.card}>
        <div className={classes.title}>
          <Typography variant='h6'>Purchase history</Typography>
        </div>
        <div className={classes.list}>
          <CardMaterial className={classes.container}>
            <CardContent>
              {history.map((h, i) => {
                return (
                  <div>
                    {h.products.map((p, i) => {
                      return (
                        <div key={i}>
                          <ListItemText primary={`Product name: ${p.name}`} />
                          <ListItemText
                            secondary={`Product price: ${p.price}`}
                          />
                          <ListItemText
                            secondary={`Purchased date: ${moment(
                              p.createdAt
                            ).fromNow()}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </CardContent>
          </CardMaterial>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Layout title='Dashboard' description={`G'day ${name}!`}>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth='sm'>
            <div className='row'>
              <div className='col-3'>{userLinks()}</div>
              <div className='col-9'>
                {userInfo()}
                {purchaseHistory(history)}
              </div>
            </div>
          </Container>
        </React.Fragment>
      </Layout>
    </div>
  )
}

export default Dashboard
