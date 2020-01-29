import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";

class Login extends Component {
   state = {
      email: "",
      password: "",
      login: false,
      errorCode: 0
   }

   componentDidMount = () => {
      if (this.props.location.errorCode !== undefined) {
         this.setState({ errorCode: this.props.location.errorCode })
      }
   }

   handleEmail = (e) => { this.setState({ email: e.target.value }) }
   handlePassword = (e) => { this.setState({ password: e.target.value }) }

   login = async () => {
      const url = "http://localhost:3000/users/login";

      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
         })

         const data = await response.json();
         const { login, errorCode } = data;

         if (!!login) {
            const { id, first_name, last_name, email } = data;
            this.props.changeLoginState({ login, id, first_name, last_name, email })
         }

         this.setState({
            login,
            errorCode
         })
      } catch (err) {
         // This error code tells us that the url is bad.
         this.setState({ errorCode: 3 });
      }
   }

   render() {
      const { login, errorCode } = this.state;
      return (
         <Card variant={"dark"} className="usersCard">
            <Card.Header as="h5">Login</Card.Header>
            <Card.Body>
               <Form>
                  <Form.Group>
                     <Form.Label>Email address</Form.Label>
                     <Form.Control id="emailAddress" type="email" onChange={(e) => this.handleEmail(e)} placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group >
                     <Form.Label>Password</Form.Label>
                     <Form.Control id="emailAddressPassword" autoComplete="on" type="password" onChange={(e) => this.handlePassword(e)} placeholder="Password" />
                  </Form.Group>
                  <Button variant="primary" onClick={(e) => this.login()}>
                     Sign In
                        </Button>
               </Form>
               {errorCode === 1 ?
                  <Alert className="alert alert-dismissible alert-danger users-alert">
                     <strong>Sorry, we couldn't find you.</strong> Try typing in your username and password again.
                        </Alert>
                  :
                  errorCode === 2
                     ?
                     <Alert className="alert alert-dismissible alert-danger users-alert">
                        <strong>You've entered in the wrong password.</strong> Please try typing in your password again.
                            </Alert>
                     : errorCode === 3
                        ?
                        <Alert className="alert alert-dismissible alert-danger users-alert">
                           <strong>Uh Oh, we are currently having issues.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                        </Alert>
                        : errorCode === 5
                           ?
                           <Alert variant={'success'} className="users-alert">
                              <strong>You've successfully created a new account!</strong> Please login with your newly created credentials.
                                    </Alert> : ''}
               <p className="mt-4">
                  No Account? <Link to="/users/register">Register</Link>
               </p>
            </Card.Body>
            {(!!login) ? <Redirect to="/users" /> : ""}
         </Card>
      )
   }
}

export default Login;