import React, { Component } from "react"
import { make_san_nicer, process_comment } from "../utilities/san_parsing"

class Tree extends Component {

    constructor(props){
        super(props)
        this.tree = this.tree.bind(this)
    }

    tree(){
        let objects = []
        objects.push()

        const first_comment = this.props.getComment(this.props.op_index, [])
        if(first_comment) objects.push(<p className="treeComment" dangerouslySetInnerHTML={{__html: process_comment(first_comment)}}></p>)

        let last_long_comment = false
        this.props.json_moves.forEach((c, id) => {
            const moves = this.props.json_moves.slice(0, id + 1)
            const comment = this.props.getComment(this.props.op_index, moves)
            let move_text = make_san_nicer(c.san)
            if(id % 2 === 0){ // all white moves
                move_text = ((id / 2) + 1).toString() + ". " + move_text
            }else if(last_long_comment){
                move_text = "... " + move_text
            }
            if(comment){
                if(comment.length > 35){
                    objects.push(<>
                        <span className="treeMoveSan">{move_text}</span>
                        <p className="treeComment" dangerouslySetInnerHTML={{__html: process_comment(comment)}}></p>
                    </>)
                    last_long_comment = true
                }else{
                    objects.push(<>
                        <span className="treeMoveSan">{move_text}</span>&nbsp;<span className="treeComment" dangerouslySetInnerHTML={{__html: process_comment(comment)}}></span>&nbsp;
                    </>)
                    last_long_comment = false
                }
            }else{
                objects.push( <span className="treeMoveSan">{move_text}&nbsp;</span> )
                last_long_comment = false
            }
        })
        return objects
    }

    render() {
        return <div id="movesTree" key="movesTree">
            {this.props.json_moves ? this.tree() : null}
        </div>
    }
}

export default Tree
