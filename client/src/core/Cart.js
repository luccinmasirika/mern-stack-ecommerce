import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Layout from './Layout'
import { getCart } from './cartHelpers'
import Card from './Card'
import Checkout from './Checkout'
import Loader from './Loader'

import {
  CardContent,
  makeStyles,
  Card as CardMaterial,
  Typography,
  Divider,
  Button,
} from '@material-ui/core'
import ShopIcon from '@material-ui/icons/Shop'

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  container: {
    paddingBottom: theme.spacing(6),
    background: '#fafaff',
  },
}))

const Cart = () => {
  const classes = useStyles()
  const [items, setItems] = useState([])
  const [run, setRun] = useState(false)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    setItems(getCart())
  }, [run])

  const showItems = (items) => {
    return (
      <div>
        <CardContent>
          <Typography variant='h6' component='h1'>
            Your cart has {`${items.length}`} items
          </Typography>
        </CardContent>
        <Divider />
          {items.length ? (
            <CardContent>
              {items.map((product, i) => (
                <Card
                  key={i}
                  product={product}
                  showAddToCartButton={false}
                  cartUpdate={true}
                  showRemoveProductButton={true}
                  setRun={setRun}
                  run={run}
                />
              ))}
            </CardContent>
          ) : (
            <CardContent>
              <Loader />
            </CardContent>
          )}
      </div>
    )
  }

  const handleRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/shop' />
    }
  }
  const noItemsMessage = () => (
    <CardContent align='center'>
      <Typography variant='h5' component='h1'>
        Your cart is empty.
      </Typography>
      <Button
        color='primary'
        onClick={() => setRedirect(true)}
        endIcon={<ShopIcon />}
      >
        Continue shopping
      </Button>
    </CardContent>
  )

  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items. Add remove checkout or continue shopping.'
    >
      <CardMaterial className={classes.container} elevation={1}>
        {items.length > 0 ? showItems(items) : noItemsMessage()}

        {handleRedirect(redirect)}
        <CardContent>
          <Checkout products={items} setRun={setRun} run={run} />
        </CardContent>
      </CardMaterial>
    </Layout>
  )
}

export default Cart
