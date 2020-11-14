import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getProducts } from './apiCore'
import Card from './Card'

import CardContent from '@material-ui/core/CardContent'
import CardMaterial from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core'
import Search from './Search'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: { marginTop: theme.spacing(2), background: '#fafaff' },
}))
const Home = () => {
  const classes = useStyles()

  const [productsBySell, setProductsBySell] = useState([])
  const [productsByArrival, setProductsByArrival] = useState([])
  const [error, setError] = useState(false)
  const [load, setLoad] = useState(false)

  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsBySell(data)
      }
    })
  }

  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsByArrival(data)
        setLoad(true)
      }
    })
  }

  useEffect(() => {
    loadProductsByArrival()
    loadProductsBySell()
  }, [])

  return (
    <div className={classes.root}>
      <Layout title='Home' description='Choice product on Buku Store'>
        <Search />
        <CardMaterial className={classes.container} elevation={1}>
          <CardContent>
            <Typography variant='h5' component='h1'>
              New Arrivals
            </Typography>
          </CardContent>
          <Divider />
          {productsByArrival.length ? (
            <CardContent align='center'>
              {productsByArrival.map((product, i) => (
                <Card key={i} product={product} />
              ))}
            </CardContent>
          ) : (
            <CardContent>
              <Loader />
            </CardContent>
          )}
        </CardMaterial>

        <CardMaterial className={classes.container}>
          <CardContent>
            <Typography variant='h5' component='h1'>
              Best Sellers
            </Typography>
          </CardContent>
          <Divider />
          {productsBySell.length ? (
            <CardContent align='center'>
              {productsBySell.map((product, i) => (
                <Card key={i} product={product} />
              ))}
            </CardContent>
          ) : (
            <CardContent>
              <Loader />
            </CardContent>
          )}
        </CardMaterial>
      </Layout>
    </div>
  )
}

export default Home
