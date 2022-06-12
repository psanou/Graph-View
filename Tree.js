class Tree {
    constructor(label_of_root){
        this.list_of_nodes = {0:new Node_t(label_of_root)};
        this.list_of_nodes[0]._setId(0);
        this.next_id = 1;
    }


    /**
     * Renders the Tree on the web. 
     * @param {*} first_container the html element id in which the tree will be rendered
     */
    _renderTree(first_container){
        this._drawNodes(this.list_of_nodes[0],first_container);
        this._drawEdges(first_container);
    }


    _getNode(id){
        if (this.list_of_nodes.hasOwnProperty(id)) {
            return this.list_of_nodes[id];
        } 
        return null;
    }

    /**
     * Draws edges between nodes.
     * @param {*} container the html element id in which the edges will be rendered
     */
    _drawEdges(container) {
        for (const key in this.list_of_nodes) {
            if (Object.hasOwnProperty.call(this.list_of_nodes, key)) {
                this.list_of_nodes[key]._getChildren().forEach(ch => {
                    let child = document.getElementById(`node_${ch._getId()}`);
                    this._connectNodes(document.getElementById(`node_${key}`),child,"black",2,container);
                });
            }
        }
    }

    /**
     * Draws nodes into the view.
     * @param {*} node the node to draw.
     * @param {*} parent_container the html element id in which contain the parent of the nodde.
     */
    _drawNodes(node,parent_container) {
        $(parent_container).append(`<div id="level_${node._getId()}" class="level"></div>`);
        $(`#level_${node._getId()}`).append(node._show());
        $(`#level_${node._getId()}`).append(`<div id="children_list_${node._getId()}" class="children_list"></div>`);
        node._getChildren().forEach(element => {
            this._drawNodes(element,`#children_list_${node._getId()}`)
        });        
    }

    
    /**
     * Adds a child to a node.
     * @param {*} parent_id the parent node id.
     * @param {*} child the node to add.
     * @returns 
     */
    _addChild(parent_id,child){
        if (this.list_of_nodes.hasOwnProperty(parent_id)) {
            child._setId(this.next_id);
            this.list_of_nodes[parent_id]._addChild(child);
            this.list_of_nodes[this.next_id++]=child;
            this.number_of_nodes++;
            return this.next_id-1;
        } 
        return -1;
    }

    /**
     * Deletes a node from the tree.
     * @param {*} node_id the id of the node to delete.
     * @param {*} attach_children_to_parent indicate whether or not we want 
     * to rattach the children of the deleted node to its parent
     */
    _deleteNode(node_id,attach_children_to_parent){
        let node = this._getNode(node_id);
        let node_parent = node._getParent();
        node_parent._removeChild(node,attach_children_to_parent);
        this._removeSubNodes(node);

    }
    
   /**
    * Remove a complete sub branch.
    * @param {*} node root node of sub branch.
    * @param {*} delete_sub_trees indicate if we have to delete sub-trees from node.
    */
    _removeSubNodes(node,delete_sub_trees){
        delete this.list_of_nodes[node._getId()];
        if (!delete_sub_trees) {
            node._getChildren().forEach(child => {
                this._removeSubNodes(child);
            });
        }
        
    }

    /**
     * Computes complete positions of an html element .
     * @param {*} el the html element
     * @returns the positions
     */
    _getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left + window.pageXOffset,
          top: rect.top + window.pageYOffset,
          width: rect.width || el.offsetWidth,
          height: rect.height || el.offsetHeight
        };
    }


    /**
     * Draws a line between two given points
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} x2 
     * @param {*} y2 
     * @param {*} color the color of the line
     * @param {*} thickness the thickness of the line
     * @param {*} container the html element id in which the line will be rendered
     */
    _drawLine(x1,y1,x2,y2,color,thickness,container) {
        const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        const cx = ((x1 + x2) / 2) - (length / 2);
        const cy = ((y1 + y2) / 2) - (thickness / 2);
        const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
        const htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
        $(container).append(htmlLine);
    }
      

    /**
     * Connects two nodes with an edges.
     * @param {*} node_parent the parent node
     * @param {*} node_child the child node
     * @param {*} color the color of the edge
     * @param {*} thickness the thickness of the edges
     * @param {*} container the html element id in which the edges will be rendered
     */
    _connectNodes(node_parent, node_child, color, thickness,container){
        const off1 = this._getOffset(node_parent);
        const off2 = this._getOffset(node_child);
        let x1 = off1.left + off1.width/2;
        let y1 = off1.top + off1.height;
        let x2 = x1;
        let y2 = y1+Math.abs(off2.top-y1)/2;
        this._drawLine(x1,y1,x2,y2,color, thickness,container);
        x1 = x2
        y1 = y2
        x2 = off2.left + off2.width/2;
        this._drawLine(x1,y1,x2,y2,color, thickness,container);
        x1 = x2
        y2 = off2.top;
        this._drawLine(x1,y1,x2,y2,color, thickness,container);
        
    }
    
    /**
     * Save the tree
     * @returns The saved tree on JSON format.
     */
    _saveTree() {
        let to_save = {nodes:{},next_id:this.next_id};
        for (const key in this.list_of_nodes) {
            let tmp = {
                id:this.list_of_nodes[key]._getId(),
                label:this.list_of_nodes[key]._getLabel(),
                color:this.list_of_nodes[key]._getColor(),
                content:this.list_of_nodes[key]._getContent(),
                children: []
            }
            this.list_of_nodes[key]._getChildren().forEach(child => {
                tmp.children.push(child._getId());
            });
            to_save.nodes[key] = tmp;
        }
        return JSON.stringify(to_save);
    }

    /**
     * Restaure the backup from a previous backup.
     * @param {*} backup the backup on JSON format
     */
    _restoreTree(backup){
        let backup_ = JSON.parse(backup)
        this.list_of_nodes = {};
        for (const key in backup_.nodes) {
            this.list_of_nodes[key] = Node_t._loadFromBackup(backup_.nodes[key]);
        }
        for (const key in this.list_of_nodes) {
            backup_.nodes[key].children.forEach(index => {
                console.log(index);
                this.list_of_nodes[key]._addChild(this.list_of_nodes[index]);
            }); 
        }
        this.next_id = backup_.next_id;
    }
}