import SearchStudent from "./SearchStudent";
import CurrentSettings from "./CurrentSettings";
import SetLimits from "./SetLimits";
import {Link} from "react-router-dom";
import './../stylesheets/AdminPanel.css';
import {Jumbotron, Button} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import React from "react";

function AdminPanelRouter() {
  return (
    <div>
      <Link to="/"><Button style={{ float: "right" }} className="btn dash-btn">Form</Button></Link>
      <Router>
				<Switch>
          <Route path="/AdminPanel/SearchStudent" component={SearchStudent} />
					<Route exact path="/AdminPanel/CurrentSettings" component={CurrentSettings} />
          <Route exact path="/AdminPanel/SetLimits" component={SetLimits} />
        </Switch>
			</Router>
    </div>
  );
}

export default AdminPanelRouter;