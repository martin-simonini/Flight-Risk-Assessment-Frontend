import SearchStudent from "./SearchStudent";
import CurrentSettings from "./CurrentSettings";
import SetLimits from "./SetLimits";
import './../stylesheets/AdminPanel.css';
import React, {Component} from 'react';
import {Jumbotron, Button} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from "react-router-dom";

// This component acts as a router for all of the admin panel pages.
class AdminPanelRouter extends Component{
    
  constructor(props) {
      super(props);

      this.state = ({});
  }

  logout(){
    sessionStorage.removeItem('loggedin')
  }

  render() {
    if(!sessionStorage.getItem('loggedin')){
      return <Redirect to='/Login' />
    }
    return (
      <div>
        <Link to="/"><Button style={{ float: "right" }} className="btn dash-btn">Form</Button></Link>
        <Link to="/Login"><Button style={{ float: "right" }} className="btn dash-btn" onClick={this.logout.bind(this)}>Logout</Button></Link>
        <Router>
  				<Switch>
            <Route exact path="/AdminPanel/SearchStudent" component={SearchStudent} />
  					<Route exact path="/AdminPanel/CurrentSettings" component={CurrentSettings} />
            <Route exact path="/AdminPanel/SetLimits" component={SetLimits} />
          </Switch>
  			</Router>
      </div>
    );
  }
}
export default AdminPanelRouter;