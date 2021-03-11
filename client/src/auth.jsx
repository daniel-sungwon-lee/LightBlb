import React, { useState } from 'react';
import { TextField } from '@material-ui/core';

export default function Auth(props) {
  const [page, setPage] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleChange = (event) => {
    const { id, value } = event.target

    if(id === "email") {
      setEmail(value)
    } else {
      setPassword(value)
    }
  }

  if(page === "login") {
    return (
      <div className="container">
        <div className="m-5">
          <img src="/images/lightblb.svg" alt="LightBlb logo" width="200" />
        </div>
        <div>
          <h1 style={{marginTop: "-1.5rem"}}>LightBlb</h1>
        </div>
        <form className="d-flex flex-column align-items-center mt-4">
          <TextField id="email" label="Email" required InputLabelProps={{required: false}}
           type="email" value={email} className="mt-4" onChange={handleChange} variant="filled" />

          <TextField id="password" label="Password" required InputLabelProps={{required: false}}
           type="password" value={password} className="mt-4" onChange={handleChange} variant="filled" />
        </form>
      </div>
    )

  } else {
    return (
      <div className="container">

      </div>
    )
  }
}
