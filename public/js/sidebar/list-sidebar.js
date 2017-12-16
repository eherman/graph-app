var ListSidebar = {
    removedElements: {
        removedNodes: {},
        removedEdges: {}
    },
    populateNodeListSidebar: function() {
        var that = this;

        var nodes = {};
        var nodeCount = 0;

        if(cy && cy.$ && cy.elements().nodes()) {

            $('.graph-displayed-count').html(cy.elements().nodes().length);
            $('.graph-total-count').html(cy.elements().nodes().length);

            cy.elements().nodes().each(function(i, node) {
                if(!nodes[node.data().type]) {
                    nodes[node.data().type] = {
                        nodes: [],
                        type: node.data().type,
                        typeCount: 0
                    };
                }
                nodes[node.data().type].typeCount++;
                nodes[node.data().type].nodes.push({
                    "id": node.data().id,
                    "name": node.data().name,
                    "checked": "checked"
                });
                nodeCount++;
            });

            $.each(that.removedElements.removedNodes, function(id, node) {
                if(!nodes[node.data().type]) {
                    nodes[node.data().type] = {
                        nodes: [],
                        type: node.data().type,
                        typeCount: 0
                    };
                }
                nodes[node.data().type].typeCount++;
                nodes[node.data().type].nodes.push({
                    "id": node.data().id,
                    "name": node.data().name,
                    "active": node.data().active,
                    "seed": node.data().seed,
                    "checked": ""
                });
                nodeCount++;
            });

        }

        var html = '';
        $.each(nodes, function(i, value) {
            html +=
            '<div class="sidebar-row">' +
                '<input class="type-checkbox" type="checkbox" checked/>' +
                '<img class="type-icon black-type-icon" src="/images/icons/black/icon.png">' +
                '<img class="type-icon white-type-icon" src="/images/icons/white/icon.png">' +
                '<span class="type-label">' + value.type + '</span>' +
                '<div class="type-expand-container expandable" data-toggle="collapse" data-target="#' + value.type + '">' +
                    '<i class="fa fa-plus"></i>' +
                    '<i class="fa fa-minus"></i>' +
                '</div>' +
                '<span class="type-count">(' + value.typeCount + ')</span>' +
            '</div>' +
            '<div id="' + value.type + '" class="moreContainer collapse in">';
                if(value.nodes) {
                    $.each(value.nodes, function(k, node) {
                        html +=
                        '<div data-value="' + node.id + '" class="item">' +
                            '<input class="item-checkbox" type="checkbox" ' + node.checked + ' />' +
                            '<div class="item-name">' +
                                node.name +
                            '</div>' +
                            '<i class="fa fa-info"></i>' +
                        '</div>';
                    });
                } else {
                    html += '<div>None</div>';
                }
            html += '</div>';
        });

        $('.sidebar-body .node-list-sidebar').empty();

        $('.sidebar .info-sidebar').hide();
        $('.sidebar .node-list-sidebar').show();

        $('.sidebar-body .node-list-sidebar').html(html);

        $('.sidebar input.type-checkbox').on('click', function(e) {
            e.stopPropagation();
            if($(this).prop('checked')) {
                var ids = [];
                $.each($($(this).parent().find('.type-expand-container').data('target')).find('.item-checkbox'), function(i, item) {
                    if(!$(item).prop('checked')) {
                        $(item).prop('checked', true);
                        ids.push($(item).parent().data('value'));
                    }
                });
                that.restoreNodes({ids:ids});
            } else {
                var ids = [];
                $.each($($(this).parent().find('.type-expand-container').data('target')).find('.item-checkbox'), function(i, item) {
                    if($(item).prop('checked')) {
                        $(item).prop('checked', false);
                        ids.push($(item).parent().data('value'));
                    }
                });
                that.removeNodes({ids:ids});
            }
        });

        $('.sidebar .sidebar-row').on('click', function(e) {
            if( !$(e.target).hasClass('type-expand-container') &&
                !$(e.target).hasClass('fa-plus') &&
                !$(e.target).hasClass('fa-minus')
            ) {
                var id = $(this).find('.type-expand-container').data('target');
                var elems = cy.collection();
                if($(this).hasClass('selected')) {
                    $(id).find('.item').each(function(i, elem) {
                        var elemID = $(elem).data('value');
                        elems = elems.add(cy.$('#' + elemID));
                    });
                    elems.unselect();
                } else {
                    $(id).find('.item').each(function(i, elem) {
                        if(!$(elem).hasClass('selected')) {
                            var elemID = $(elem).data('value');
                            elems = elems.add(cy.$('#' + elemID));
                        }
                    });
                    window.overrideSelect = true;
                    elems.select();
                }
            }
        });

        $('.sidebar input.item-checkbox').on('click', function(e) {
            e.stopPropagation();
            var id = $(this).parent().data('value');
            if($(this).prop('checked')) {
                that.restoreNodes({ids:[id]});
                $('.sidebar').find("[data-target='#" + $(this).parent().parent().prop('id') + "']").parent().find('input').prop('checked', true);
            } else {
                that.removeNodes({ids:[id]});
                if($('#' + $(this).parent().parent().prop('id') + ' .item-checkbox:checkbox:checked').length === 0) {
                    $('.sidebar').find("[data-target='#" + $(this).parent().parent().prop('id') + "']").parent().find('input').prop('checked', false);
                }
            }
        });

        $('.sidebar .item .fa-info').on('click', function(e) {
            e.stopPropagation();
            var id = $(this).parent().data('value');
            InfoSidebar.populateInfoSidebar(cy.$('#' + id).data());
        });

        $('.sidebar .item').on('click', function(e) {
            if($(this).hasClass('selected')) {
                var id = $(this).data('value');
                cy.$('#' + id).unselect();
            } else {
                var id = $(this).data('value');
                if($(this).parent().find('.item-checkbox').prop('checked')) {
                    window.overrideSelect = true;
                    cy.$('#' + id).select();
                }
            }
        });

        $('.sidebar .item').qtip({
            content: function() {
                var text = $(this).find('.item-name').html();
                var nameArray = text.split('&lt;');
                var name = nameArray[0];
                var type = '&lt;' + nameArray[1];
                return '<div style="text-align:center;">' +
                        name +
                        '<br>' +
                        type +
                        '</div>';
            },
            position: {
                my: 'left center',
                at: 'right center'
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
                delay: 50,
                fixed: true
            }
        });

        $('.sidebar .item').on("contextmenu", function(e) {
            e.preventDefault();
            CXTMenu.open({
                "id": $(this).data('value'),
                "x": e.pageX,
                "y": e.pageY
            });
        });

    },
    removeNodes: function(args) {
        var that = this;

        var ids = args.ids;
        $.each(ids, function(index, id) {
            if(cy.getElementById(id).length > 0) {
                $('.sidebar [data-value=' + id + ']').removeClass('selected');
                cy.getElementById(id).connectedEdges().unselect();
                cy.getElementById(id).unselect();
                var edges = cy.getElementById(id).connectedEdges();
                var elem = cy.getElementById(id);

                $.each(edges, function(i, edge) {
                    that.removedElements.removedEdges[edge.data('id')] = edge.remove();
                });
                that.removedElements.removedNodes[id] = elem.remove();
            }
        });

        $('.graph-displayed-count').html(cy.elements().nodes().length);

        return args;
    },
    restoreNodes: function(args) {
        var that = this;

        var ids = args.ids;
        $.each(ids, function(index, id) {
            if(that.removedElements.removedNodes[id]) {
                that.removedElements.removedNodes[id].restore();
                delete that.removedElements.removedNodes[id];

                $.each(that.removedElements.removedEdges, function(key, edge) {
                    if(cy.$('#' + edge.data().source).inside() && cy.$('#' + edge.data().target).inside()) {
                        edge.restore();
                        delete that.removedElements.removedEdges[key];
                    }
                });
            }
        });

        $('.graph-displayed-count').html(cy.elements().nodes().length);

        return args;
    },
    removeElems: function(ids) {
        var that = this;

        $.each(ids, function(index, id) {
            $('.sidebar [data-value=' + id + '] input').prop("checked", false);
            if($('#' + $('[data-value=' + id + ']').parent().prop('id') + ' .item-checkbox:checkbox:checked').length === 0) {
                $('.sidebar').find("[data-target='#" + $('[data-value=' + id + ']').parent().prop('id') + "']").parent().find('input').prop('checked', false);
            }
        });

        that.removeNodes({ids:ids});
    },
    restoreElems: function(ids) {
        var that = this;

        $.each(ids, function(index, id) {
            $('.sidebar [data-value=' + id + '] input').prop("checked", true);
            $('.sidebar').find("[data-target='#" + $('[data-value=' + id + ']').parent().prop('id') + "']").parent().find('input').prop('checked', true);
        });

        that.restoreNodes({ids:ids});
    },
    restoreAllElems: function() {
        var that = this;

        var ids = [];
        $.each(that.removedElements.removedNodes, function(id, node) {
            ids.push(id);
        });
        that.restoreNodes({ids:ids});
        $('.sidebar input').prop("checked", true);
    },
    selectElem: function(ids) {
        var that = this;

        $.each(ids, function(i, id) {
            $('.sidebar [data-value=' + id + ']').addClass('selected');
            var container = $('[data-value=' + id + ']').parent();
            var rowElem = $('.sidebar').find("[data-target='#" + container.prop('id') + "']").parent();
            if(container.find('.item.selected').length === 0) {
                rowElem.removeClass('selected');
                rowElem.removeClass('partial-selected');
            } else if(container.find('.item').length === container.find('.item.selected').length) {
                rowElem.addClass('selected');
                rowElem.removeClass('partial-selected');
            } else {
                rowElem.removeClass('selected');
                rowElem.addClass('partial-selected');
            }
        });
    },
    unselectElem: function(ids) {
        var that = this;

        $.each(ids, function(i, id) {
            $('.sidebar [data-value=' + id + ']').removeClass('selected');
            var container = $('[data-value=' + id + ']').parent();
            var rowElem = $('.sidebar').find("[data-target='#" + container.prop('id') + "']").parent();
            if(container.find('.item.selected').length === 0) {
                rowElem.removeClass('selected');
                rowElem.removeClass('partial-selected');
            } else if(container.find('.item').length === container.find('.item.selected').length) {
                rowElem.addClass('selected');
                rowElem.removeClass('partial-selected');
            } else {
                rowElem.removeClass('selected');
                rowElem.addClass('partial-selected');
            }
        });
    }
};
