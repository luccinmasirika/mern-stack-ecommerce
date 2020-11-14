import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import Card from './Card'

import { getCategories, getFilteredProducts } from './apiCore'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'
import { prices } from './fixedPrices'

import CardContent from '@material-ui/core/CardContent'
import CardMaterial from '@material-ui/core/Card'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FilterListIcon from '@material-ui/icons/FilterList'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'

import { makeStyles } from '@material-ui/core/styles'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  List,
  Paper,
  Typography,
} from '@material-ui/core'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: { marginBottom: theme.spacing(2), background: '#fafaff' },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingLeft: theme.spacing(2),
  },
}))

const Shop = () => {
  const classes = useStyles()

  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)
  const [loader, setLoader] = useState(false)
  const [limit, setLimit] = useState(6)
  const [skip, setSkip] = useState(0)
  const [size, setSize] = useState(0)
  const [filteredResults, setFilteredResults] = useState([])

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setCategories(data)
      }
    })
  }

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setFilteredResults(data.data)
        setSize(data.size)
        setSkip(0)
      }
    })
  }

  const loadMore = () => {
    let toSkip = skip + limit
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setFilteredResults([...filteredResults, ...data.data])
        setSize(data.size)
        setSkip(toSkip)
      }
    })
  }

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Paper
          elevation={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2ch',
          }}
        >
          <Button
            onClick={loadMore}
            color='secondary'
            endIcon={<PlaylistAddIcon />}
          >
            Load more
          </Button>
        </Paper>
      )
    )
  }

  useEffect(() => {
    init()
    loadFilteredResults(skip, limit, myFilters.filters)
  }, [])

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters }
    newFilters.filters[filterBy] = filters

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters)
      newFilters.filters[filterBy] = priceValues
    }
    loadFilteredResults(myFilters.filters)
    setMyFilters(newFilters)
  }

  const handlePrice = (value) => {
    const data = prices
    let array = []

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array
      }
    }
    return array
  }

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loader}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Layout title='Shop' description='Search and find product on Buku store'>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <FilterListIcon />
            <Typography align='center' className={classes.heading}>
              Filter by categories
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <List>
              <Checkbox
                categories={categories}
                handleFilters={(filters) => handleFilters(filters, 'category')}
              />
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <FilterListIcon />
            <Typography align='center' className={classes.heading}>
              Filter by price range
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, 'price')}
            />
          </AccordionDetails>
        </Accordion>
        <CardMaterial className={classes.container} elevation={0}>
          <CardContent align='center'>
            <Typography align='center' variant='h5' component='h1'>
              Products
            </Typography>
          </CardContent>
          <Divider />
          {filteredResults.length ? (
            <CardContent align='center'>
              {filteredResults.map((product, i) => (
                <Card key={i} product={product} />
              ))}
            </CardContent>
          ) : (
            <CardContent>
              <Loader />
              {filteredResults.length === 0 && (
                <Typography align='center' variant='h6' component='h2'>
                  {filteredResults.length} found
                </Typography>
              )}
            </CardContent>
          )}
          <Divider />
          {loadMoreButton()}
        </CardMaterial>
      </Layout>
    </div>
  )
}

export default Shop
