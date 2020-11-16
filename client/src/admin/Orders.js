import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin'
import moment from 'moment'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'

import CardMaterial from '@material-ui/core/Card'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: '#fafaff',
  },
  link: { color: '#3f51b5', textDecoration: 'none' },
  card: {
    margin: theme.spacing(2),
  },
  title: { padding: theme.spacing(2) },
  container: { margin: theme.spacing(2) },
  list: {},
}))

const Orders = () => {
  const classes = useStyles()
  const [orders, setOrders] = useState([])
  const [statusValues, setStatusValues] = useState([])

  const { user, token } = isAuthenticated()

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOrders(data)
      }
    })
  }

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setStatusValues(data)
      }
    })
  }

  useEffect(() => {
    loadOrders()
    loadStatusValues()
  }, [])

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <Typography align='center' variant='h5' component='h1'>
          Total orders: {orders.length}
        </Typography>
      )
    } else {
      return (
        <Typography align='center' variant='h5' component='h1'>
          No orders
        </Typography>
      )
    }
  }

  const showList = (key, value) => (
    <List>
      <ListItemText primary={key} />
      <ListItemText secondary={value} />
    </List>
  )

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log('Status update failed')
      } else {
        loadOrders()
      }
    })
  }

  const showStatus = (o) => (
    <div className='form-group'>
      <Typography variant='h6' component='h2'>
        Status: {o.status}
      </Typography>
      <FormControl style={{ width: '80%' }}>
        <Select
          labelId='select-status'
          displayEmpty
          onChange={(e) => handleStatusChange(e, o._id)}
        >
          <MenuItem>Update Status</MenuItem>
          {statusValues.map((status, index) => (
            <MenuItem key={index} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )

  return (
    <Layout
      title='Orders'
      description={`G'day ${user.name}, you can manage all the orders here`}
    >
      <CardMaterial className={classes.root}>
        <CardContent>{showOrdersLength()}</CardContent>
        <Divider />

        {orders.map((o, oIndex) => {
          return (
            <CardMaterial className={classes.container} key={oIndex}>
              <CardContent>
                <Typography variant='h6' component='h3'>
                  Order ID:
                </Typography>
                <Typography
                  variant='h6'
                  color='textSecondary'
                  component='h6'
                  style={{ fontSize: '14px' }}
                >
                  {o._id}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <List>
                  <ListItemText primary={showStatus(o)} />
                  <ListItemText
                    primary={`Transaction ID: ${o.transaction_id}`}
                  />
                  <ListItemText primary={`Amount: ${o.amount}`} />
                  <ListItemText primary={`Ordered by: ${o.user.name}`} />
                  <ListItemText
                    primary={`Ordered on: ${moment(o.createdAt).fromNow()}`}
                  />
                  <ListItemText primary={`Delivery address: ${o.address}`} />
                </List>
              </CardContent>
              <Divider />

              <CardContent>
                <Typography variant='h6' component='h3'>
                  {`Total products in the order: ${o.products.length}`}
                </Typography>
              </CardContent>
              <Divider />

              {o.products.map((p, pIndex) => (
                <CardContent key={pIndex}>
                  {showList('Product name', p.name)}
                  {showList('Product price', p.price)}
                  {showList('Product total', p.count)}
                  {showList('Product Id', p._id)}
                  <Divider />
                </CardContent>
              ))}
            </CardMaterial>
          )
        })}
      </CardMaterial>
    </Layout>
  )
}

export default Orders
