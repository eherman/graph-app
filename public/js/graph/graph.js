var Graph = {
    graph: null,
    cyStyles: null,
    elements: null,
    init: function(data) {
        this.elements = data.elements;
        this.cyStyles = data.styles;
        this.addCytoscape();
    },
    update: function() {
        var that = this;
        cy.add(that.elements);
        cy.layout({name: 'breadthfirst'});
        cy.fit(cy.elements(), 80);
        ListSidebar.populateNodeListSidebar();
    },
    addCytoscape: function(elements) {
        var that = this;
        window.cy = $('#cy')
            .cytoscape({
            style: that.cyStyles,
            elements: null,
            wheelSensitivity: 0.3,
            ready: function(){
                window.cy = this;
                that.update();

                var selectedIDs = [];
                cy.elements().on('select', function(e) {
                    var target = e.cyTarget;
                    selectedIDs.push(target.data().id);
                    if(window.SELECTED_TIMEOUT) {
                        clearTimeout(window.SELECTED_TIMEOUT);
                    }
                    window.SELECTED_TIMEOUT = setTimeout(function() {
                        var target = e.cyTarget;
                        if(target != cy) {
                            ListSidebar.selectElem(selectedIDs);
                            if( cy.$(':selected').length === 1 &&
                                selectedIDs.length === 1 &&
                                !window.overrideSelect
                            ) {
                                InfoSidebar.populateInfoSidebar(target.data());
                                Sidebar.sidebarOpen(true);
                            } else {
                                InfoSidebar.populateInfoSidebar();
                            }
                            window.overrideSelect = false;
                            Sidebar.sidebarOpen(true);
                            selectedIDs = [];
                            $('.graph-selected-count').html(cy.$(':selected').length);
                        }
                    }, 100);
                });

                var unselectedIDs = [];
                cy.elements().on('unselect', function(e) {
                    var target = e.cyTarget;
                    unselectedIDs.push(target.data().id);
                    if(window.UNSELECTED_TIMEOUT) {
                        clearTimeout(window.UNSELECTED_TIMEOUT);
                    }
                    window.UNSELECTED_TIMEOUT = setTimeout(function() {
                        if(target != cy) {
                            if(selectedIDs.length === 0) {
                                InfoSidebar.populateInfoSidebar();
                            }
                            ListSidebar.unselectElem(unselectedIDs);
                            unselectedIDs = [];
                            $('.graph-selected-count').html(cy.$(':selected').length);
                        }
                    }, 100);
                });

                cy.nodes().qtip({
                    content: function() {
                        var nameArray = this.data('name').split('<');
                        var name = nameArray[0];
                        var type = '&lt;' + nameArray[1].split('>')[0] + '&gt;';

                        return '<div style="text-align:center;">' +
                                name +
                                '<br>' +
                                type +
                                '<br>' +
                                '<button data-value="' +
                                this.data('id') +
                                '" class="btn btn-xs btn-primary qtip-details-btn">Details</button>' +
                                '</div>';
                    },
                    events: {
                        visible: function(event, api) {
                            $('.qtip-details-btn').on('click', function() {
                                var id = $(this).data('value');
                                InfoSidebar.populateInfoSidebar(cy.$('#' + id).data());
                                Sidebar.sidebarOpen(true);
                                var tooltip = api.elements.tooltip;
                                tooltip.hide();
                            });
                        }
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    style: {
                        classes: 'qtip-bootstrap',
                        tip: {
                            width: 16,
                            height: 8
                        }
                    },
                    show: {
                        event: 'mouseover'
                    },
                    hide: {
                        event: 'mouseout',
                        leave: false
                    }
                });

                cy.on('cxttap', function(e) {
                    var target = e.cyTarget;
                    if(target != cy) {
                        CXTMenu.open({
                            "id": target.data('id'),
                            "x": e.originalEvent.pageX,
                            "y": e.originalEvent.pageY,
                            "origin": "graph"
                        });
                    }
                });

                cy.on('click', function(e) {
                    $(document.activeElement).blur();
                });
            }
        });
    }
};
