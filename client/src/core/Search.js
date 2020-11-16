import React, { useState, useEffect } from 'react'
import { getCategories, list } from './apiCore'
import Card from './Card'

import { makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CardMaterial from '@material-ui/core/Card'
import SearchIcon from '@material-ui/icons/Search'
import { CardContent, MenuItem, Select, Typography } from '@material-ui/core'

import FilterList from '@material-ui/icons/FilterList'
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  container: { marginBottom: theme.spacing(2), background: '#fafaff' },
  select: {
    height: 44,
    background: '#fff',
    '&:before': {
      // normal
      border: 'none',
    },
    '&:after': {
      // focused
      border: 'none',
      background: '#fff',
    },
    '&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):before': {
      // hover
      border: 'none',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
}))

const Search = () => {
  const classes = useStyles()
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
    loader: false,
  })

  const { categories, category, search, results, searched, loader } = data

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setData({ ...data, categories: data })
      }
    })
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const searchData = () => {
    // console.log(search, category)
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            setData({ ...data, loader: false })
          } else {
            setData({
              ...data,
              results: response,
              loader: false,
              searched: true,
            })
          }
        }
      )
    }
  }

  const searchSubmit = (e) => {
    e.preventDefault()
    searchData()
  }

  const handleChange = (name) => (event) => {
    setData({
      ...data,
      [name]: event.target.value,
      loader: false,
      searched: false,
    })
  }

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`
    }
    if (searched && results.length < 1) {
      return `No product found`
    }
  }

  const searchedProducts = (results = []) => {
    return (
      <CardMaterial elevation={1}>
        <CardContent>
          <Typography align='center' variant='h5' component='h1'>
            {searchMessage(searched, results)}
          </Typography>
        </CardContent>
        <Divider />
        {results.length ? (
          <CardContent align='center'>
            {results.map((product, i) => (
              <Card key={i} product={product} />
            ))}
          </CardContent>
        ) : (
          <CardContent align='center'>
            <Loader />
          </CardContent>
        )}
      </CardMaterial>
    )
  }

  const searchForm = () => (
    <CardMaterial className={classes.container} elevation={1}>
      <form onSubmit={searchSubmit} className={classes.root}>
        <IconButton
          type='submit'
          className={classes.iconButton}
          aria-label='search'
        >
          <SearchIcon />
        </IconButton>
        <InputBase
          placeholder='Search...'
          onChange={handleChange('search')}
          className={classes.input}
          inputProps={{ 'aria-label': 'search buku store' }}
        />
        <Divider className={classes.divider} orientation='vertical' />
        <div className={classes.iconButton}>
          <Select
            labelId='select-category'
            id='category'
            className={classes.select}
            autoWidth={true}
            value={category}
            IconComponent={FilterList}
            onChange={handleChange('category')}
          >
            <MenuItem value='All'>All</MenuItem>
            {categories.map((c, i) => (
              <MenuItem key={i} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </form>
    </CardMaterial>
  )

  return (
    <div>
      <div>{searchForm()}</div>
      <div>{searched && searchedProducts(results)}</div>
    </div>
  )
}

export default Search
