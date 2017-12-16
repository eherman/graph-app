;(function () {

    $(document).ready(function() {

        var initData = {};

        // Load dummy graph by default
        $.ajax({
            url: 'loadGraph'
        }).done(function(data) {
            initData.elements = data;
            $.ajax({
                url: '/css/cy.css'
            }).done(function(data) {
                initData.styles = data.toString();
                Graph.init(initData);
                Sidebar.init();
                CXTMenu.init();
            });
        });

    });

}());
