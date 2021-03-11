import React, { useEffect, useState } from 'react';
import { IconButton, TextField, Button, CircularProgress } from '@material-ui/core';
import { MeetingRoomRounded, PersonAddRounded, ArrowBackRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  icon: {
    color: "#694D33",
    fontSize: "3rem"
  },
  button: {
    borderRadius: "1rem",
    padding: "0.5rem 2rem",
    fontSize: "23px",
    marginTop: "2rem"
  }
})

export default function Auth(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [errText, setErrText] = useState('')

  useEffect(() => {

   setLoading(false)

  }, [])

  const handleChange = (event) => {
    const { id, value } = event.target

    if(id === "email") {
      setEmail(value)
    } else {
      setPassword(value)
    }
  }

  const handleSwitch = () => {
    if(page === "login") {
      setPage("signup")
      setEmail("")
      setPassword("")

    } else {
      setPage("login")
      setEmail("")
      setPassword("")
    }
  }

  const handleSignUp = (event) => {
    setLoading(true)
    event.preventDefault()

    const reqBody = { email, password }

    fetch('/api/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    })
      .then(() => {
        setPage("login")
        setLoading(false)
      })
      .catch(() => window.location.reload())
  }

  const handleLogin = () => {

  }

  if(loading) {
    return (
      <div className="spinner">
        <CircularProgress color="inherit" thickness={4} size={50} />
      </div>
    )

  } else {

    if(page === "login") {
      return (
        <div className="container">
          <div className="m-5">
            <img src="/images/lightblb.svg" alt="LightBlb logo" width="200" />
          </div>
          <div>
            <h1 style={{marginTop: "-1.5rem"}}>LightBlb</h1>
          </div>
          <form className="d-flex flex-column align-items-center mt-4" onSubmit={handleLogin}>
            <TextField id="email" label="Email" required InputLabelProps={{required: false}}
             type="email" value={email} className="mt-4" onChange={handleChange} variant="filled"
             error={error} />

            <TextField id="password" label="Password" required InputLabelProps={{required: false}}
             type="password" value={password} className="mt-4" onChange={handleChange} variant="filled"
             error={error} helperText={errText} />

            <IconButton className="mt-2" type="submit">
              <MeetingRoomRounded className={classes.icon} />
            </IconButton>
          </form>
          <Button className={classes.button} color="default" startIcon={<PersonAddRounded />}
            onClick={handleSwitch}>
            Sign Up
          </Button>
        </div>
      )

    } else {
      return (
        <div className="container">
          <div className="m-5">
            <img src="/images/lightblb.svg" alt="LightBlb logo" width="200" />
          </div>
          <div>
            <h1 style={{ marginTop: "-1.5rem" }}>LightBlb</h1>
          </div>
          <form className="d-flex flex-column align-items-center mt-4" onSubmit={handleSignUp}>
            <TextField id="email" label="Email" required InputLabelProps={{ required: false }}
              type="email" value={email} className="mt-4" onChange={handleChange} variant="filled" />

            <TextField id="password" label="Password" required InputLabelProps={{ required: false }}
              type="password" value={password} className="mt-4" onChange={handleChange} variant="filled" />

            <IconButton className="mt-2" type="submit">
              <PersonAddRounded className={classes.icon} />
            </IconButton>
          </form>
          <IconButton onClick={handleSwitch} style={{ marginTop: "2rem" }}>
            <ArrowBackRounded fontSize="large" />
          </IconButton>
        </div>
      )
    }

  }

}
