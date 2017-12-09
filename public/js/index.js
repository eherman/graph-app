;(function () {

    $(document).ready(function() {

        var cyStyles = null;
        var elements = null;

        // Load dummy graph by default
        $.ajax({
            url: 'loadGraph'
        }).done(function(data) {
            elements = data;
            $.ajax({
                url: '/css/cy.css'
            }).done(function(data) {
                cyStyles = data.toString();
                addCytoscape(elements);
            });
        });

        function addCytoscape() {
            window.cy = $('#cy')
                .cytoscape({
                style: cyStyles,
                elements: null,
                wheelSensitivity: 0.3,
                ready: function(){
                    window.cy = this;
                    addGraph();

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
                                Radio('selectElem').broadcast(selectedIDs);
                                if( cy.$(':selected').length === 1 &&
                                    selectedIDs.length === 1 &&
                                    !window.overrideSelect
                                ) {
                                    Radio('populateInfoSidebar').broadcast(target.data());
                                    Radio('sidebarOpen').broadcast(true);
                                } else {
                                    Radio('populateInfoSidebar').broadcast();
                                }
                                window.overrideSelect = false;
                                // Radio('sidebarOpen').broadcast(true);
                                selectedIDs = [];
                                $('.graph-selected-count').html(cy.$(':selected').length);
                                // Radio('updateMenu').broadcast();
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
                                    Radio('populateInfoSidebar').broadcast();
                                }
                                Radio('unselectElem').broadcast(unselectedIDs);
                                unselectedIDs = [];
                                $('.graph-selected-count').html(cy.$(':selected').length);
                                // Radio('updateMenu').broadcast();
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
                                    Radio('populateInfoSidebar').broadcast(cy.$('#' + id).data());
                                    Radio('sidebarOpen').broadcast(true);
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
                            Radio('cxtMenu').broadcast({
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

        function addGraph() {
            cy.add(elements);
            cy.layout({name: 'breadthfirst'});
            cy.fit(cy.elements(), 80);
            // Radio('populateNodeListSidebar').broadcast();
        }

    });

}());
