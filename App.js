import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import RiskAssessmentForm from "./components/RiskAssessmentForm";
import AdminPanelRouter from "./components/AdminPanelRouter";

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import React from "react";
import DynamicFormInput from "./components/DynamicFormInput";



function App() {
  return (
      <div className="App">
        <Router>
					<Switch>
            <Route exact path="/" component={RiskAssessmentForm} />
						<Route exact path="/AdminPanel/SearchStudent" component={AdminPanelRouter} />
            <Route exact path="/AdminPanel/CurrentSettings" component={AdminPanelRouter} />
            <Route exact path="/AdminPanel/SetLimits" component={AdminPanelRouter} />
			<Route path="AdminPanel/LoginForm" component = {AdminPanelRouter} />
          </Switch>
				</Router>
      </div>
  );
}

export default App;
