import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Home from './core/Home'
import Shop from './core/Shop';

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/shop' exact component={Shop} />
          <Route path='/signin' exact component={Signin} />
          <Route path='/signup' exact component={Signup} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
