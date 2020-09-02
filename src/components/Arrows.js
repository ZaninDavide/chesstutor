import React, { Component } from "react"
import { cells, cells_rotated } from "../utilities/pieces_and_coords"

class Arrows extends Component {

  get_arrows(arrows, rotated = false) {
    return arrows.map(a => {
      const cells_list = rotated ? cells_rotated : cells
      const from = {
        x: cells_list[a.from[0]] / 8 + 100 / 16,
        y: cells_list[a.from[1]] / 8 + 100 / 16
      }
      const to = {
        x: cells_list[a.to[0]] / 8 + 100 / 16,
        y: cells_list[a.to[1]] / 8 + 100 / 16
      }

      const extra = 100 / 16
      if (to.x - from.x === 0) {
        to.y -= extra * Math.sign(to.y - from.y)
      } else {
        const alpha = Math.atan((to.y - from.y) / (to.x - from.x))
        to.x -= extra * Math.cos(alpha) * Math.sign(to.x - from.x)
        to.y -= extra * Math.sin(alpha) * Math.sign(to.x - from.x)
      }

      return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ markerEnd: "url(#ArrowMarker)", strokeWidth: 2.5, stroke: "var(--arrow)", opacity: .4 }} key={`arrow_${a.from}_${a.to}`} />
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
          style={{ overflow: "visible" }}>
          <path
            id="path983"
            d="M 5.77,0.0 L -2.88,5.0 L -2.88,-5.0 L 5.77,0.0 z "
            style={{ fillRule: "evenodd", stroke: "var(--arrow)", strokeWidth: "1pt", fill: "var(--arrow)" }}
            transform="scale(0.25)" />
        </marker>
      </defs>
      {this.get_arrows(this.props.arrows, this.props.rotated)}
    </svg>
  }

}

export default Arrows
