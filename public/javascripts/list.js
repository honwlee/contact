(function($) {
    function showAndSave(data) {
        var method, url = "/api/contacts";
        if (data) {
            method = "PUT";
            url = url + "/" + data.id;
            ["busNum", "time", "username", "mobile"].forEach(function(key) {
                $("#" + key).val(data[key]);
            });
        } else {
            method = "POST";
            ["busNum", "time", "username", "mobile"].forEach(function(key) {
                $("#" + key).val("");
            });
        }
        $("#formModal").modal('show');
        $("#saveContact").off("click");
        $("#saveContact").on("click", function() {
            $.ajax({
                type: method,
                url: url,
                data: {
                    busNum: $("#busNum").val(),
                    time: $("#time").val(),
                    username: $("#username").val(),
                    mobile: $("#mobile").val()
                }
            }).done(function(cbData) {
                if (data) {
                    $('#contactList').bootstrapTable('remove', {
                        field: 'id',
                        values: [data.id]
                    });
                }
                $('#contactList').bootstrapTable('prepend', [cbData]);
                // $('#contactList').bootstrapTable('refresh');
                $("#formModal").modal('hide');
            });
        });
    };

    // table item format
    function operateFormatter(value, row, index) {
        return [
            '<a class="edit" href="javascript:void(0)" title="编辑">',
            '<i class="glyphicon glyphicon-edit"></i>',
            '</a>  ',
            '<a class="remove" href="javascript:void(0)" title="删除">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>'
        ].join('');
    };

    function totalTextFormatter(data) {
        return data;
    }

    // table event
    window.operateEvents = {
        'click .edit': function(e, value, row, index) {
            editContact(row.id);
        },
        'click .remove': function(e, value, row, index) {
            $('#confirm').modal({
                backdrop: 'static',
                keyboard: false
            }).off('click', '#delete');
            $('#confirm').modal({
                backdrop: 'static',
                keyboard: false
            }).on('click', '#delete', function(e) {
                removeContact(row.id, function() {
                    $('#contactList').bootstrapTable('remove', {
                        field: 'id',
                        values: [row.id]
                    });
                });
            });
        }
    };

    // edit contact
    function editContact(id) {
        $.ajax({
            type: "GET",
            url: "/api/contacts/" + id,
        }).done(function(data) {
            showAndSave(data);
        });
    };

    // remove contact
    function removeContact(id, callback) {
        $.ajax({
            type: "DELETE",
            url: "/api/contacts/" + id,
        }).done(function() {
            callback.call();
        });
    };

    function initTable() {
        // fill list
        $.ajax({
            type: "GET",
            url: "/api/contacts"
        }).done(function(data) {
            var columns = [{
                field: 'id',
                title: '标识符',
                visible: false,
                align: 'center',
                formatter: totalTextFormatter
            }, {
                field: 'busNum',
                title: '车次',
                sortable: true,
                align: 'center',
                formatter: totalTextFormatter
            }, {
                field: 'time',
                title: '发车时间',
                sortable: true,
                align: 'center',
                formatter: totalTextFormatter
            }, {
                field: 'username',
                title: '联系人',
                sortable: true,
                align: 'center',
                formatter: totalTextFormatter
            }, {
                field: 'mobile',
                title: '联系电话',
                sortable: true,
                align: 'center',
                formatter: totalTextFormatter
            }];
            if ($("#__username__").text()) {
                columns.push({
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    events: operateEvents,
                    formatter: operateFormatter
                });
            }
            $('#contactList').bootstrapTable({
                responseHandler: function(res) {
                    return res;
                },
                sortName: "id",
                sortOrder: "desc",
                columns: columns,
                data: data.map(function(item) {
                    return {
                        id: item.id,
                        busNum: item.busNum,
                        time: item.time,
                        username: item.username,
                        mobile: item.mobile
                    };
                })
            });
        });

        $("#addContact").click(function() {
            showAndSave();
        });
    };

    initTable();
})(jQuery);
