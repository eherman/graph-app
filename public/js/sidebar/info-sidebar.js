var InfoSidebar = {
    populateInfoSidebar: function(data) {
        var that = this;

        $('.sidebar .info-sidebar').empty();
        if(data) {

            $('.sidebar .node-list-sidebar').hide();
            $('.sidebar .info-sidebar').show();

            var generalData = {};
            var primeData = ['name', 'type', 'seed', 'active', 'date'];
            $.each(primeData, function(i, val) {
                if(data[val]) {
                    generalData[val] = data[val];
                }
            });

            var html =
            '<div class="info-sidebar-header">' +
                '<div class="title-container">' +
                    '<img class="type-icon" src="/images/icons/black/icon.png" style="margin-top:4px; margin-right:6px;">' +
                    '<span class="title">' + data.name + '</span>' +
                '</div>' +
                '<i class="back-btn fa fa-remove"></i>' +
            '</div>' +
            '<div class="info-sidebar-body">' +
                '<div class="divider-container">' +
                    '<div id="details-scroll-target" class="divider-label">Details</div>' +
                    '<div class="divider-line"></div>' +
                '</div>' +
                '<div class="info-container">';
                    $.each(generalData, function(key, value) {
                        html +=
                        '<div class="key-label">' + key + '</div>' +
                        '<div class="value-label">' + value + '</div>';
                    });
                html += '</div>';
                if(data) {
                    html +=
                    '<div class="divider-container">' +
                        '<div id="other-stuff-scroll-target" class="divider-label">Other Stuff</div>' +
                        '<div class="divider-line"></div>' +
                    '</div>' +
                    '<div class="info-container">';
                        $.each(generalData, function(key, value) {
                            html +=
                            '<div class="key-label">' + key + '</div>' +
                            '<div class="value-label">' + value + '</div>';
                        });
                    html += '</div>';
                }
            html += '</div>';

            $('.sidebar .sidebar-body .info-sidebar').html(html);

            $('.sidebar .back-btn').on('click', function() {
                that.populateInfoSidebar();
            });

        } else {

            $('.sidebar .info-sidebar').hide();
            $('.sidebar .node-list-sidebar').show();

        }
    }
};
