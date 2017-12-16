var Sidebar = {
    width: 253,
    init: function() {
        var that = this;
        that.responsiveResize();
        $(window).resize(function(){
            that.responsiveResize();
        });

        $('.graph-view .sidebar-btn').on('click', function() {
            if($('.graph-view .sidebar').hasClass('open')) {
                that.sidebarOpen(false);
            } else {
                that.sidebarOpen(true);
            }
            $('.graph-view .sidebar-btn').blur();
        });

        var dragging = false;
        $('.graph-view .sidebar-dragbar').mousedown(function(e){
            e.preventDefault();
            dragging = true;
            $(document).mousemove(function(e) {
                that.sidebarResize(e.pageX + 2);
            });
        });
        $(document).mouseup(function(e){
            if(dragging) {
                $(document).unbind('mousemove');
                dragging = false;
            }
        });
    },
    sidebarOpen: function(open) {
        var that = this;
        if(open) {
            $('.graph-view .sidebar').addClass('open');
            $('.graph-view .sidebar-btn .fa-caret-left').show();
            $('.graph-view .sidebar-btn .fa-caret-right').hide();

            $('.graph-view .sidebar').css('width', that.width);
            $('.graph-view .sidebar-btn').css('left', that.width);
            $('.graph-view .graph-menu-container').css('left', 30 + that.width);
            $('.graph-view .search-field').css('left', that.width + 32);

            $('.graph-view .logo-container').hide();
            $('.graph-view .top-left-container.graph-status-container').hide();
            $('.graph-view .top-left-container.graph-count-container').hide();

            var offset = ($('.graph-view .toolbar-middle').width() - that.width)/2;
            $('.graph-view .toolbar-middle').css('left', 'calc(50% - ' + offset + 'px)');
        } else {
            $('.graph-view .sidebar').removeClass('open');
            $('.graph-view .sidebar-btn .fa-caret-left').hide();
            $('.graph-view .sidebar-btn .fa-caret-right').show();

            $('.graph-view .sidebar-btn').css('left', 0);
            $('.graph-view .graph-menu-container').css('left', 30);
            $('.graph-view .search-field').css('left', 285);

            $('.graph-view .logo-container').show();
            $('.graph-view .top-left-container.graph-status-container').show();
            $('.graph-view .top-left-container.graph-count-container').show();

            var offset = $('.graph-view .toolbar-middle').width()/2;
            $('.graph-view .toolbar-middle').css('left', 'calc(50% - ' + offset + 'px)');
        }
        that.responsiveResize();
    },
    sidebarResize: function(width) {
        var that = this;
        if(width) {
            if(width < 253) {
                that.width = 253;
            } else if(width > 400) {
                that.width = 400;
            } else {
                that.width = width;
            }
        }

        if($('.graph-view .sidebar').hasClass('open')) {
            $('.graph-view .sidebar').css('width', that.width);
            $('.graph-view .sidebar-btn').css('left', that.width);
            $('.graph-view .graph-menu-container').css('left', 30 + that.width);
            $('.graph-view .search-field').css('left', that.width + 32);

            var offset = ($('.graph-view .toolbar-middle').width() - that.width)/2;
            $('.graph-view .toolbar-middle').css('left', 'calc(50% - ' + offset + 'px)');
        }

        that.responsiveResize();
    },
    responsiveResize: function() {
        var sidebarWidth = 0;
        if($('.graph-view .sidebar').hasClass('open')) {
            sidebarWidth = $('.graph-view .sidebar').width();
        }
        var containerSize = $('body').width() - sidebarWidth;

        if(containerSize < 700) {
            $('.graph-view .toolbar-middle .btn').css('width', '50px');
            $('.graph-view .toolbar-middle .toolbar-full-text').css('display', 'none');
        } else {
            $('.graph-view .toolbar-middle .btn').css('width', '95px');
            $('.graph-view .toolbar-middle .toolbar-full-text').css('display', 'inline-block');
        }
        var offset = ($('.graph-view .toolbar-middle').width() - sidebarWidth)/2;
        $('.graph-view .toolbar-middle').css('left', 'calc(50% - ' + offset + 'px)');

        if($('.graph-view .sidebar').hasClass('open')) {
            if(containerSize < 600) {
                $('.graph-view .search-field').css('width', containerSize - 247.5);
            } else {
                $('.graph-view .search-field').css('width', 350);
            }
        } else {
            if(containerSize < 850) {
                $('.graph-view .search-field').css('width', containerSize - 500);
            } else {
                $('.graph-view .search-field').css('width', 350);
            }
        }
    }
};
