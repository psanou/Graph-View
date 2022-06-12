/**
 * The class representing a node in the graph
 */
class Node_t {
    
    constructor(label,content="",color="white"){
        this.label = label;
        this.content = content;
        this.children = [];
        this.id = -1;
        this.color = color;
        this.parent = null;
    }

    /**
     * Create a new node from a backup of a node . 
     * @param {*} backup a JS object containing the saved node atrributes
     * @returns a new node_t object.
     */
    static _loadFromBackup(backup){
        var node = new Node_t(backup.label,backup.content,backup.color);
        node._setId(backup.id);
        return node;
        
    }

    _setColor(color) {
        this.color = color;
    }

    _getId(){
        return this.id;
    }

    _setId(id){
        this.id = id;
    }

    _setParent(parent){
        this.parent=parent;
    }

    _getParent(){
        return this.parent;
    }

    /**
     * Add a child to a node.
     * @param {*} child the child to add.
     */
    _addChild(child){
        child._setParent(this);
        this.children.push(child);
    }

    /**
     * Remove a child from a node.
     * @param {*} child the child to remove.
     */
    _removeChild(child, take_sub_child){
        let child_index = this._getChildren().indexOf(child);
        console.log(child_index);
        this.children = this.children.slice(0,child_index).concat(this.children.slice(child_index+1,this.children.length));
        if (take_sub_child) {
            for (let i = child._getChildren().length-1; i >= 0; i--) {
                let sub_child = child._getChildren()[i];
                sub_child._setParent(this);
                this.children.splice(child_index, 0, sub_child);
            }
        }
        
    }

    /**
     * 
     * @param {*} content 
     */
    _setContent(content){
        this.content = content
    }

    /**
     * 
     * @param {*} content 
     */
    _setLabel(label){
        this.label = label
    }

    /**
     * 
     * @returns 
     */
    _getLabel(){
        return this.label;
    }

    /**
     * 
     * @returns 
     */
     _getColor(){
        return this.color;
    }
    
    /**
     * 
     * @returns 
     */
    _getContent(){
        return this.content;
    }
        

    /**
     * 
     * @returns 
     */
    _getChildren(){
        return this.children;
    }
    

    /**
     * Show the node into the view.
     * @returns the representation of the node.
     */
    _show(){
        return `<div class="node ${this.color}" id="node_${this.id}">
        <p class="label">
            ${this.label}
            <button class="edit" id="${this.id}" title="edit"><i id="${this.id}" class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
            <button class="delete" id="${this.id}" title="delete"><i id="${this.id}" class="fa fa-trash-o" aria-hidden="true"></i></button>
        </p>
            <div class="content">
                ${this.content}
            </div>
        </div>` ;
    }

    
}