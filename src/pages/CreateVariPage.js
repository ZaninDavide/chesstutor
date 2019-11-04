import React from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

function CreateVariPage() {
  return (
    <React.Fragment>
      <Header title={<Translator text={"New variation"} />} />
      <div className="page">
        <h2>CreateVariPage</h2>
        <p>White, 3 varietions</p>
        <button className="importantButton">login</button>
      </div>
    </React.Fragment>
  )
}

export default CreateVariPage
