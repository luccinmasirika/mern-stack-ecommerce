import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from './apiAdmin'

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

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

function TablePaginationActions(props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

const useStyles2 = makeStyles({
  table: {
    minWidth: '100%',
  },
})

const ManageProducts = () => {
  const classes = useStyles2()

  const [products, setProducts] = useState([])
  const { user, token } = isAuthenticated()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
  }

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        loadProducts()
      }
    })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <Layout title='Manage Products' description='Perform CRUD on products'>
      <Card>
        <CardActions>
          <Typography align='center' variant='h5' component='h1'>
            Total: {products.length} products
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
              {(rowsPerPage > 0
                ? products.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : products
              ).map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell component='th' style={{ width: '5%' }} scope='row'>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ width: '45%' }} align='left'>
                    {row.name}
                  </TableCell>
                  <TableCell style={{ width: '25%' }} align='right'>
                    <Link to={`/admin/product/update/${row._id}`}>
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

              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
            <TableFooter>
              {/* <TableRow>
                <TablePagination
                  //   rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  //   colSpan={1}
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  //   SelectProps={{
                  //     inputProps: { 'aria-label': 'rows per page' },
                  //     native: true,
                  //   }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  //   ActionsComponent={TablePaginationActions}
                />
              </TableRow> */}
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  )
}

export default ManageProducts
