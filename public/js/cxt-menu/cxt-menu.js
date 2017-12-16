var CXTMenu = {
    init: function() {
        $('#cxt-menu a.cxt-menu-info-btn').on('click', function() {
            if(!$(this).parent().hasClass('disabled')) {
                var id = $('#cxt-menu').data('value');
                InfoSidebar.populateInfoSidebar(cy.$('#' + id).data());
                Sidebar.sidebarOpen(true);
            }
        });

        $('#cxt-menu a.cxt-menu-select-btn').on('click', function() {
            if(!$(this).parent().hasClass('disabled')) {
                var id = $('#cxt-menu').data('value');
                var target = cy.$('#' + id);
                target.select();
            }
        });

        $('#cxt-menu a.cxt-menu-deselect-btn').on('click', function() {
            if(!$(this).parent().hasClass('disabled')) {
                var id = $('#cxt-menu').data('value');
                var target = cy.$('#' + id);
                target.unselect();
            }
        });

        $('#cxt-menu a.cxt-menu-hide-btn').on('click', function() {
            if(cy && cy.$ && cy.nodes().length > 1 && !$(this).parent().hasClass('disabled')) {
                var id = $('#cxt-menu').data('value');
                cy.$('#' + id).unselect();
                ListSidebar.removeElems([id]);
            }
        });

        $('#cxt-menu a.cxt-menu-show-btn').on('click', function() {
            if(cy && cy.$ && !$(this).parent().hasClass('disabled')) {
                var id = $('#cxt-menu').data('value');
                ListSidebar.restoreElems([id]);
            }
        });
    },
    open: function(data) {
        var that = this;

        var parent = data.parent || 'body';
        var origin = data.origin || 'other';

        if(origin === 'graph') {

            if(cy.$('#' + data.id).isNode()) {
                $('#cxt-menu a.cxt-menu-hide-btn').parent().css('display', 'inline');
                $('#cxt-menu a.cxt-menu-show-btn').parent().css('display', 'inline');
                $('#cxt-menu .show-hide-divider').css('display', 'list-item');
                $('#cxt-menu a.cxt-menu-hide-btn').parent().removeClass('disabled');
                $('#cxt-menu a.cxt-menu-show-btn').parent().addClass('disabled');
            } else {
                $('#cxt-menu a.cxt-menu-hide-btn').parent().css('display', 'none');
                $('#cxt-menu a.cxt-menu-show-btn').parent().css('display', 'none');
                $('#cxt-menu .show-hide-divider').css('display', 'none');
            }

        } else {

            $('#cxt-menu a.cxt-menu-hide-btn').parent().css('display', 'inline');
            $('#cxt-menu a.cxt-menu-show-btn').parent().css('display', 'inline');
            $('#cxt-menu .show-hide-divider').css('display', 'list-item');
            if(cy.$('#' + data.id).isNode()) {
                $('#cxt-menu a.cxt-menu-hide-btn').parent().removeClass('disabled');
                $('#cxt-menu a.cxt-menu-show-btn').parent().addClass('disabled');
            } else {
                $('#cxt-menu a.cxt-menu-hide-btn').parent().addClass('disabled');
                $('#cxt-menu a.cxt-menu-show-btn').parent().removeClass('disabled');
            }

        }

        $('#cxt-menu a.cxt-menu-select-btn').parent().removeClass('disabled');
        $('#cxt-menu a.cxt-menu-deselect-btn').parent().removeClass('disabled');

        $('#cxt-menu-btn').click();

        if(data.x + 117 > $(parent).width()) {
            $('#cxt-menu').css('left', data.x - 117);
        } else {
            $('#cxt-menu').css('left', data.x - 5);
        }

        if(data.y + 150 > $(parent).height()) {
            $('#cxt-menu').css('top', data.y - 150);
        } else {
            $('#cxt-menu').css('top', data.y - 5);
        }

        $('#cxt-menu').data('value', data.id);
        var target = cy.$('#' + data.id);

        if(target.selectable()) {
            if(target.selected()) {
                $('#cxt-menu a.cxt-menu-select-btn').parent().addClass('disabled');
            } else {
                $('#cxt-menu a.cxt-menu-deselect-btn').parent().addClass('disabled');
            }
        } else {
            $('#cxt-menu a.cxt-menu-select-btn').parent().addClass('disabled');
            $('#cxt-menu a.cxt-menu-deselect-btn').parent().addClass('disabled');
        }
    }
};
