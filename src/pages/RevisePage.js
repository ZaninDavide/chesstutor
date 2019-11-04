import React from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

function RevisePage() {
  return (
    <React.Fragment>
      <Header title={<Translator text={"Revise"} />} />
      <div className="page">
        <h2>TrainingPage</h2>
        <p>White, 3 variants</p>
        <button className="importantButton">login</button>
      </div>
    </React.Fragment>
  )
}

export default RevisePage
