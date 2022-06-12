$(function() {  
    var tree = new Tree("root");
    let container = $('#edition-content').get(0);
    let toolbarOptions = [
        { 'header': [2, 3, 4, 5, 6, false] },
        'bold', 'italic', 'underline', 'strike',        // toggled buttons
        'blockquote', 'code-block',
        { 'list': 'ordered'}, { 'list': 'bullet' },
        { 'color': [] }, { 'background': [] },          // dropdown with defaults from theme
    ];

    // init the WYSWYG editor in the editor 
    let editor = new Quill(container, {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
          }
    });

    // refreshing the view at every screen resizing
    refresh_view();
    $(window).resize(function() {
        refresh_view();
    });    

    // Action taken when we click on save button
    $("#save-btn").click(function(){
        save_graph("graph");
    })

    // Action taken when we click on save button
    $("#restaure-btn").click(function(){
        restaure_graph("graph");
        refresh_view();

    })
    
    // Action taken when we click on edit button
    $(document).on("click",".edit",(e) => {
        let id = e.target.id;
        show_edition(id);
    })

    // Action taken when we click on delete button
    $(document).on("click",".delete",(e) => {
        let id = e.target.id;
        delete_node(id);
        refresh_view();
    })

    // Action taken when we double click on a node
    $(document).on("dblclick",".node ",(e) => {
        e.stopPropagation();
        let id = e.target.id.split("_")[1];
        show_edition(id);
    })


    // Action taken when we click on the edition close button
    $(".close-edition-btn").click(() => {
        hide_edition();
    })

    // Action taken when we click on the edition validate button
    $(".validate-edition-btn").click((e) => {
        let id = e.target.id;
        update_node(id)
        hide_edition();
        refresh_view();
    })

    // Action taken when we click on the add node button
    $(".add-node-btn").click((e) => {
        let id = e.target.id;
        add_node(id);
    })


    /**
     * Update a node after edited it in the edition panel
     * @param {*} node_id the id of the node to edit.
     */
    function update_node(node_id) {
        let selected_node = tree._getNode(node_id);
        if (selected_node) {
            selected_node._setLabel($("#edition-label").val());
            selected_node._setContent(editor.getLength()>1 ? editor.root.innerHTML : "");
            selected_node._setColor($("input[type='radio'][name='edition-color']:checked").val());
            $(".edition").hide();
        }
    }

    /**
     * Show the edition panel filled with the node to edit properties
     * @param {*} node_id the node to edit id.
     */
    function show_edition(node_id) {
        let selected_node = tree._getNode(node_id);
        if (selected_node) {
            $(".edition #edition-label").val(selected_node._getLabel());
            editor.root.innerHTML = selected_node._getContent();
            $("#color-fieldset #"+selected_node._getColor()).prop("checked", true);
            $(".edition .validate-edition-btn").prop("id", node_id);
            $(".edition .add-node-btn").prop("id", node_id);
            $(".edition").show();
        }
    }

    /**
     * Deletes a node.
     * @param {*} node_id the id of the node to delete
     * @returns 
     */
    function delete_node(node_id) {
        if(confirm("Do you really what to delete this node? if you are not sure, make a backup before")){
            if (node_id != 0) {
                let attach_child_to_parent = confirm("Attach children to the parent ?");
                tree._deleteNode(node_id,attach_child_to_parent);
            } else {
                alert("Cannot delete the root");
            }
        }
    }
    
    /**
     * Hides the edition panel
     */
    function hide_edition() {
        $(".edition").hide();
    }
    
    /**
     * Add a new node.
     * @param {*} parent_id id of the parent node.
     */
    function add_node(parent_id) {
        let node = new Node_t("new label");
        let child_id = tree._addChild(parent_id,node);
        refresh_view();
        show_edition(child_id);
    }

    /**
     * Refresh the view
     */
    function refresh_view() {
        $("#graph").html('');
        tree._renderTree("#graph");  
    }

    /**
     * Save the graph.
     * For the moment, it will erase the previous backup. 
     * Graph exportation to json file will be soon available.
     * @param {*} name name of the backup. 
     */
    function save_graph(name) {
        let save = tree._saveTree();
        console.log(save);
        if (localStorage.getItem(name)) {
            localStorage.removeItem(name)
        }
        localStorage.setItem(name, save);
    }

    /**
     * Restaure the graph
     * @param {*} name name of the backup
     */
    function restaure_graph(name) {
        let save = localStorage.getItem(name);
        console.log(save);

        if (save) {
            tree._restoreTree(save);
        } else {
            alert("graph not found");
        }
    }

    
})


