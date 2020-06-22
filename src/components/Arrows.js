import React, { Component } from "react"

const cells = {
  "1": "700",
  "2": "600",
  "3": "500",
  "4": "400",
  "5": "300",
  "6": "200",
  "7": "100",
  "8": "0",
  h: "700",
  g: "600",
  f: "500",
  e: "400",
  d: "300",
  c: "200",
  b: "100",
  a: "0"
}

const cellsRotated = {
  "1": "0",
  "2": "100",
  "3": "200",
  "4": "300",
  "5": "400",
  "6": "500",
  "7": "600",
  "8": "700",
  h: "0",
  g: "100",
  f: "200",
  e: "300",
  d: "400",
  c: "500",
  b: "600",
  a: "700"
}

class Arrows extends Component {

  get_arrows(arrows, rotated = false){
    return arrows.map(a => {
      const cells_list = rotated ? cellsRotated : cells
      const from = {  
                    x: cells_list[a.from[0]] / 8 + 100/16,
                    y: cells_list[a.from[1]] / 8 + 100/16
      }
      const to = {  
                    x: cells_list[a.to[0]] / 8 + 100/16,
                    y: cells_list[a.to[1]] / 8 + 100/16
      }

      const extra = 100/16
      if(to.x - from.x === 0){
        to.y -= extra * Math.sign(to.y - from.y)
      }else{
        const alpha = Math.atan((to.y - from.y)/(to.x - from.x))
        to.x -= extra * Math.cos(alpha) * Math.sign(to.x - from.x)
        to.y -= extra * Math.sin(alpha) * Math.sign(to.x - from.x)
      }

      return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{markerEnd: "url(#ArrowMarker)", strokeWidth: 4, stroke: "var(--arrowColor)", opacity: .4}} key={`arrow_${a.from}_${a.to}`} />
    })
  }

  render() {
    return <svg
      width="100%"
      viewBox="0 0 100 100"
      id="arrows_svg"
      key="arrows_svg"
    >
      <defs id="defs">
        <marker
          orient="auto"
          refY="0.0"
          refX="0.0"
          id="ArrowMarker"
          style={{overflow: "visible"}}>
          <path
            id="path983"
            d="M 5.77,0.0 L -2.88,5.0 L -2.88,-5.0 L 5.77,0.0 z "
            style={{fillRule: "evenodd", stroke: "var(--arrowColor)", strokeWidth: "1pt", fill:"var(--arrowColor)"}}
            transform="scale(0.15)" />
        </marker>
      </defs>
      {this.get_arrows(this.props.arrows)}
    </svg>
  }

}

export default Arrows
