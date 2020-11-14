import React from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import Dashboard from '@material-ui/icons/Dashboard'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconHome from '@material-ui/icons/Home'
import StoreIcon from '@material-ui/icons/Store'
import ShopIcon from '@material-ui/icons/ShopTwoRounded'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Badge, Button, CardActionArea } from '@material-ui/core'

import { signout, isAuthenticated } from '../auth'
import { itemTotal } from './cartHelpers'

const drawerWidth = 240

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#3f51b5' }
  }
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    zIndex: theme.zIndex.drawer + 99,
    position: 'relative',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  link: { color: '#121212', textDecoration: 'none' },
}))

const NavBar = ({ history, window }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <Link to='/' className={classes.link}>
          <ListItem
            button
            style={isActive(history, '/')}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <IconHome style={isActive(history, '/')} />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
        </Link>
        <Link to='/shop' className={classes.link}>
          <ListItem
            button
            style={isActive(history, '/shop')}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <StoreIcon style={isActive(history, '/shop')} />
            </ListItemIcon>
            <ListItemText primary='Shop' />
          </ListItem>
        </Link>
        <Link to='/cart' className={classes.link}>
          <ListItem
            button
            style={isActive(history, '/cart')}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <ShoppingCartIcon style={isActive(history, '/cart')} />
            </ListItemIcon>
            <ListItemText primary='Cart' />
          </ListItem>
        </Link>
      </List>
      <Divider />
      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <List>
          <Link to='/user/dashboard' className={classes.link}>
            <ListItem
              button
              style={isActive(history, '/user/dashboard')}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <Dashboard style={isActive(history, '/user/dashboard')} />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
          </Link>
        </List>
      )}
      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <List>
          <Link to='/admin/dashboard' className={classes.link}>
            <ListItem
              button
              style={isActive(history, '/admin/dashboard')}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <Dashboard style={isActive(history, '/admin/dashboard')} />
              </ListItemIcon>
              <ListItemText primary='Admin Dashboard' />
            </ListItem>
          </Link>
        </List>
      )}
      <Divider />
      {!isAuthenticated() && (
        <List>
          <Link to='/signin' className={classes.link}>
            <ListItem
              button
              style={isActive(history, '/signin')}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <LockOpenIcon style={isActive(history, '/signin')} />
              </ListItemIcon>
              <ListItemText primary='Login' />
            </ListItem>
          </Link>
          <Link to='/signup' className={classes.link}>
            <ListItem
              button
              style={isActive(history, '/signup')}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <PersonAddIcon style={isActive(history, '/signup')} />
              </ListItemIcon>
              <ListItemText primary='Register' />
            </ListItem>
          </Link>
        </List>
      )}
      <List>
        {isAuthenticated() &&
          ['Signout'].map((text, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                handleDrawerToggle()
                signout(() => {
                  history.push('/')
                })
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            onClick={() => history.push('/')}
            className={classes.title}
          >
            Buku Store
          </Typography>
          <div>
            <IconButton
              aria-label='cart of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={() => history.push('/cart')}
              color='inherit'
            >
              <Badge badgeContent={itemTotal()} color='secondary'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            {isAuthenticated() && (
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={() =>
                  history.push(`/profile/${isAuthenticated().user._id}`)
                }
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  )
}
export default withRouter(NavBar)
