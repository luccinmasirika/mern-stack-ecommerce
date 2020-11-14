import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import moment from 'moment'
import { addItem, updateItem, removeItem } from './cartHelpers'
import { API } from '../config'

import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import CardMaterial from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CardHeader from '@material-ui/core/CardHeader'
import {
  Backdrop,
  CardActionArea,
  Chip,
  Divider,
  TextField,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginTop: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
  qte: { position: 'absolute', left: 10, top: 10 },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(3),
  },
}))

const Card = ({
  product,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const classes = useStyles()
  let history = useHistory()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const [redirect, setRedirect] = useState(false)
  const [count, setCount] = useState(product.count)

  const onShowProduct = () => {
    return history.push(`/product/${product._id}`)
  }
  const addToCart = () => {
    addItem(product, setRedirect(true))
  }

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />
    }
  }

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <IconButton aria-label='cart'>
          <AddShoppingCartIcon color='primary' onClick={addToCart} />
        </IconButton>
      )
    )
  }

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <Chip
        color='secondary'
        label='In Stock'
        icon={<CheckCircleOutlineIcon />}
        className={classes.qte}
      />
    ) : (
      <Chip
        color='secondary'
        label='Out of Stock'
        icon={<NotInterestedIcon />}
        className={classes.qte}
      />
    )
  }

  const handleChange = (productId) => (event) => {
    setRun(!run) // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value)
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value)
    }
  }

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <CardContent align='center'>
          <TextField
            id='count'
            label='Adjust Quantity'
            type='number'
            className={clsx(classes.margin, classes.textField)}
            variant='outlined'
            value={count}
            onChange={handleChange(product._id)}
          />
        </CardContent>
      )
    )
  }
  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <IconButton aria-label='cart'>
          <RemoveShoppingCartIcon
            color='secondary'
            onClick={() => {
              removeItem(product._id)
              setRun(!run) // run useEffect in parent Cart
            }}
          />
        </IconButton>
      )
    )
  }
  return (
    <CardMaterial className={classes.root}>
      <CardActionArea onClick={onShowProduct}>
        <CardHeader title={product.category && product.category.name} />
        <Divider />
        <div style={{ position: 'relative' }}>
          <CardMedia
            className={classes.media}
            image={`${API}/product/photo/${product._id}`}
            title={`Image of ${product.name}`}
          />
          {showStock(product.quantity)}
        </div>
        {shouldRedirect(redirect)}
        <Divider />
        <CardContent className={classes.head}>
          <Typography align='center' variant='h5' component='h1'>
            {product.name}
          </Typography>
          <Typography variant='h6' color='error' align='center' component='h2'>
            {product.price}$
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p'>
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        {showAddToCartBtn(showAddToCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Divider />
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography gutterBottom variant='h6' component='h3'>
            <b> {product.category && product.category.name}</b> category
          </Typography>
          <Typography paragraph>
            Added on {moment(product.createdAt).fromNow()}
          </Typography>
          {showCartUpdateOptions(cartUpdate)}
        </CardContent>
      </Collapse>
    </CardMaterial>
  )
}

export default Card
