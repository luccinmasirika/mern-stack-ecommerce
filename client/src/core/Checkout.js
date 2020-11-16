import React, { useState, useEffect } from 'react'
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore'
import { emptyCart } from './cartHelpers'
import { isAuthenticated } from '../auth'
import { Link, Redirect } from 'react-router-dom'
// import "braintree-web"; // not using this package
import DropIn from 'braintree-web-drop-in-react'
import {
  Backdrop,
  Button,
  CircularProgress,
  makeStyles,
  Snackbar,
  CardContent,
  Card as CardMaterial,
  Typography,
  Divider,
  TextField,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
}))

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  })

  const classes = useStyles()
  const [redirect, setRedirect] = useState(false)

  const userId = isAuthenticated() && isAuthenticated().user._id
  const token = isAuthenticated() && isAuthenticated().token

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        console.log('erro token', data.error)
        setData({ ...data, error: data.error })
      } else {
        console.log('Data token', data)
        setData({ clientToken: data.clientToken })
      }
    })
  }

  useEffect(() => {
    getToken(userId, token)
  }, [])

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value })
  }

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    }, 0)
  }

  const handleRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/signin' />
    }
  }

  const handleClose = () => {
    return setData({ ...data, success: false })
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <CardContent>{showDropIn()}</CardContent>
    ) : (
      <CardContent>
        <Link to='/signin' style={{ color: '#fff', textDecoration: 'none' }}>
          <Button
            color='primary'
            variant='contained'
            onClick={() => setRedirect(true)}
            style={{ width: '100%' }}
          >
            Signin to checkout
          </Button>
        </Link>
      </CardContent>
    )
  }

  let deliveryAddress = data.address

  const buy = () => {
    setData({ loading: true })
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        // console.log(data);
        nonce = data.nonce
        // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log(
        //     "send nonce and total to process: ",
        //     nonce,
        //     getTotal(products)
        // );
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        }

        processPayment(userId, token, paymentData)
          .then((response) => {
            console.log(response)
            // empty cart
            // create order

            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress,
            }

            createOrder(userId, token, createOrderData)
              .then((response) => {
                emptyCart(() => {
                  setRun(!run) // run useEffect in parent Cart
                  console.log('payment success and empty cart')
                  setData({
                    loading: false,
                    success: true,
                  })
                })
              })
              .catch((error) => {
                console.log(error)
                setData({ loading: false })
              })
          })
          .catch((error) => {
            console.log(error)
            setData({ loading: false })
          })
      })
      .catch((error) => {
        console.log('dropin error: ', error)
        setData({ ...data, error: error.message })
      })
  }

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <TextField
            id='adress'
            label='Delivery address:'
            variant='outlined'
            type='textarea'
            value={data.address}
            onChange={handleAddress}
            style={{ paddingBottom: '10px', width: '100%' }}
            placeholder='Type your delivery address here...'
          />

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <Button
            onClick={buy}
            style={{ paddingTop: '10px', width: '100%' }}
            variant='contained'
            color='primary'
          >
            Buy now
          </Button>
        </div>
      ) : (
        <CardContent>
          <Loader />
        </CardContent>
      )}
    </div>
  )

  const showError = (error) => (
    <Snackbar open={error} autoHideDuration={3000} onClose={handleClose}>
      <Alert severity='error' onClose={handleClose}>
        {error}
      </Alert>
    </Snackbar>
  )

  const showSuccess = (success) => (
    <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
      <Alert severity='success' onClose={handleClose}>
        Thanks! Your payment was successful!
      </Alert>
    </Snackbar>
  )

  return (
    <CardMaterial className={classes.container}>
      <Backdrop className={classes.backdrop} open={data.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      {products.length > 0 && (
        <div>
          <CardContent>
            <Typography variant='h5' component='h1'>
              TOTAL: ${getTotal()}
            </Typography>
          </CardContent>
          <Divider />
          {showCheckout()}
        </div>
      )}
      {handleRedirect(redirect)}
      {showSuccess(data.success)}
      {showError(data.error)}
    </CardMaterial>
  )
}

export default Checkout
