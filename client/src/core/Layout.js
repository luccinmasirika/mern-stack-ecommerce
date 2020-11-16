import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import NavBar from './NavBar'
import Typography from '@material-ui/core/Typography'
import headBg from '../assets/headBg.jpg'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    paddingTop: theme.spacing(6),
  },
  jumbotron: {
    background: `url(${headBg})`,
    backgroundSize: 'cover',
  },
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    background: '#f50057af',
    color: '#fff',
  },
}))

const Layout = ({
  title = 'Title',
  description = 'Description',
  className,
  children,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.jumbotron}>
        <div className={classes.container}>
          <Typography variant='h4' noWrap>
            {title}
          </Typography>
          <Typography variant='subtitle1'>{description}</Typography>
        </div>
      </div>
      <div className={className}>{children}</div>
    </div>
  )
}

export default Layout
