import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { read, listRelated } from './apiCore'
import Card from './Card'

import CardContent from '@material-ui/core/CardContent'
import CardMaterial from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(6),
  },
  container: { marginTop: theme.spacing(2), background: '#fafaff' },
}))

const Product = (props) => {
  const classes = useStyles()
  const [product, setProduct] = useState({})
  const [relatedProduct, setRelatedProduct] = useState([])
  const [error, setError] = useState(false)

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProduct(data)
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setRelatedProduct(data)
          }
        })
      }
    })
  }

  useEffect(() => {
    const productId = props.match.params.productId
    loadSingleProduct(productId)
  }, [props])

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0, 100)
      }
    >
      <CardMaterial className={classes.container} elevation={1}>
        {product && product.description ? (
          <CardContent align='center'>
            {product && product.description && <Card product={product} />}
          </CardContent>
        ) : (
          <CardContent>
            <Loader />
          </CardContent>
        )}
      </CardMaterial>
      {relatedProduct.length > 0 && (
        <CardMaterial className={classes.container} elevation={1}>
          <CardContent>
            <Typography variant='h5' component='h1'>
              Related products
            </Typography>
          </CardContent>
          <Divider />
          <CardContent align='center'>
            {relatedProduct.map((product, i) => (
              <Card key={i} product={product} />
            ))}
          </CardContent>
        </CardMaterial>
      )}
    </Layout>
  )
}

export default Product
