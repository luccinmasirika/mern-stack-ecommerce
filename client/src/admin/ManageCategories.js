import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { getCategories, deleteCategory } from './apiAdmin'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { Card, CardActions, TableHead, Typography } from '@material-ui/core'

import UpdateIcon from '@material-ui/icons/Update'
import DeleteIcon from '@material-ui/icons/DeleteForever'

const useStyles = makeStyles({ table: { minWidth: '100%' } })

const ManageCategories = () => {
  const classes = useStyles()

  const [ categories, setCategories ] = useState([])
  const { user, token } = isAuthenticated()

  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error)
        console.log(data)
      } else {
        setCategories(data)
      }
    })
  }

  const destroy = categoryId => {
    deleteCategory(categoryId, user._id, token).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        loadCategories()
      }
    })
  }

  useEffect(
    () => {
      loadCategories()
    },
    []
  )

  return (
    <Layout title='Manage Products' description='Perform CRUD on categories'>
      <Card>
        <CardActions>
          <Typography align='center' variant='h5' component='h1'>
            Total: {categories.length} categories
          </Typography>
        </CardActions>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align='Left'>Name</TableCell>
                <TableCell align='right'>Update</TableCell>
                <TableCell align='right'>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell
                    component='th'
                    style={{ width: '5%' }}
                    scope='row'
                    >
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ width: '45%' }} align='left'>
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: '25%' }} align='right'>
                    <Link to={`/admin/category/update/${row._id}`}>
                      <IconButton>
                        <UpdateIcon color='primary' />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell style={{ width: '25%' }} align='right'>
                    <IconButton onClick={() => destroy(row._id)}>
                      <DeleteIcon color='error' />
                    </IconButton>
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  )
}

export default ManageCategories
