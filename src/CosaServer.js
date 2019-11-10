// App.js

setBearer = async (bearer, redirectTo = "/") => {
    this.setState({ bearer, redirectTo })
    localStorage.setItem("bearer", bearer)

    // get decks
    let userData = await fetch(
        "https://chesstutorserver.herokuapp.com/user",
        {
            headers: {
                Authorization: "Bearer " + bearer,
            },
        }
    ).then(res => res.json())
}

logout = () => {
    localStorage.removeItem("bearer")
    this.setState({ bearer: null, redirectTo: "/login", decks: [] })
}

updateUserData = (refresh = true) => {
    fetch("https://chesstutorserver.herokuapp.com/user", {
        body: JSON.stringify(newUserData),
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + this.state.bearer,
        },
        method: "POST",
    })

    // probabilmente non ti serve
    // if (refresh) this.forceUpdate()
}

// LoginPage

login = async () => {
    const res = await fetch(
        "https://chesstutorserver.herokuapp.com/login",
        {
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        }
    ).then(res => res.text())

    this.props.setBearer(res)
}

signup = async () => {
    const res = await fetch(
        "https://chesstutorserver.herokuapp.com/signup",
        {
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        }
    ).then(res => res.text())

    this.props.setBearer(res)
}