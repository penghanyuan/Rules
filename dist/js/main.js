function getFileName() {
    var url = this.location.href
    var pos = url.lastIndexOf("/");
    if (pos == -1) {
        pos = url.lastIndexOf("\\")
    }
    var filename = url.substr(pos + 1)
    return filename;
}

// function GetQueryString(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) return unescape(r[2]);
//     return null;
// }
var getParam = function(key) {
    var lot = location.search;
    var reg = new RegExp(".*" + key + "\\s*=([^=&#]*)(?=&|#|).*", "g");
    return decodeURIComponent(lot.replace(reg, "$1"));
}
var getFlow = function(i) {
    if (i == 1) {
        return "导线印字";
    }
    if (i == 2) {
        return "套管印写";
    }
    if (i == 3) {
        return "划线";
    }
    if (i == 4) {
        return "套保护套";
    }
    if (i == 5) {
        return "扎线处理";
    }
    if (i == 6) {
        return "端头处理（死接头处理）";
    }
    if (i == 7) {
        return "焊接";
    }
    if (i == 8) {
        return "压接";
    }
    if (i == 9) {
        return "通道测试";
    }
}

function getNum(text) {
    var value = text.replace(/[^0-9]/ig, "");
    return value;
}
var setRules = function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#rules-content").append("<tr><td>" + (i + 1) + "</td><td>" + data[i]["rule_content"] + "</td></tr>")
    }
}
var setSearchRules = function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#search-rules").append("<tr><td>" + getFlow(data[i]["flow_id"]) + "</td><td>" + data[i]["rule_content"] + "</td></tr>")
    }
}
var setAllRules = function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#all-rules").append("<tr><td>" + getFlow(data[i]["flow_id"]) + "</td><td>" + data[i]["rule_content"] + "</td><td>" + data[i]["rule_date"] + "</td><td><button class='delete-rule btn btn-danger'>删除</button><input type='hidden' value=" + data[i]["rule_id"] + "></td></tr>")
    }
    $(".delete-rule").click(function() {

        var id = $($(this).siblings("input")).val();
        if (confirm("确定要删除吗？")) {
            $.ajax({
                type: "POST",
                url: "../controller/index.php",
                data: {
                    func: "deleterules",
                    id: id
                },
                dataType: "json",
                success: function(data) {
                    location.reload();
                }
            });
        } else {
            return;
        }


    })
}
var setCheckRules = function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#check-rules").append("<tr><td>" + getFlow(data[i]["flow_id"]) + "</td><td>" + data[i]["rule_content"] + "</td><td>" + data[i]["rule_date"] + "</td><td><button class='refuse-rule btn btn-danger'>拒绝</button><button class='pass-rule btn btn-info'>通过</button><input type='hidden' value=" + data[i]["rule_id"] + "></td></tr>")
    }
    $(".pass-rule").click(function() {
        var id = $($(this).siblings("input")).val();
        if (confirm("确定要通过吗？")) {
            $.ajax({
                type: "POST",
                url: "../controller/index.php",
                data: {
                    func: "changestatus",
                    id: id,
                    status: 1
                },
                dataType: "json",
                success: function(data) {
                    location.reload();
                }
            });
        } else {
            return;
        }

    });
    $(".refuse-rule").click(function() {
        var id = $($(this).siblings("input")).val();
        if (confirm("确定要拒绝吗？")) {
            $.ajax({
                type: "POST",
                url: "../controller/index.php",
                data: {
                    func: "changestatus",
                    id: id,
                    status: -1
                },
                dataType: "json",
                success: function(data) {
                    location.reload();
                }
            });
        } else {
            return;
        }

    });
}
var setRefuseRules = function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#check-rules").append("<tr><td>" + getFlow(data[i]["flow_id"]) + "</td><td>" + data[i]["rule_content"] + "</td><td>" + data[i]["rule_date"] + "</td></tr>")
    }

}
$(window).ready(function() {
    if (getFileName() == "allrules.html") {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "searchrules",
                key: ""
            },
            dataType: "json",
            success: function(data) {
                setAllRules(data);
            }
        });
    }
    if (getFileName() == "refuse.html") {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "refuserules",
            },
            dataType: "json",
            success: function(data) {
                setRefuseRules(data);
            }
        });
    }
    if (getFileName() == "check.html") {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "checkrules",
            },
            dataType: "json",
            success: function(data) {

                setCheckRules(data);
            }
        });
    }
    if (getFileName() == "index.html") {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "sessiontest",
            },
            dataType: "json",
            success: function(data) {
                if (data["uname"] == "admin") {
                    $("#side-menu").append('<li><a href="admin.html"><i class="fa fa-dashboard fa-fw"></i> 管理界面首页</a></li>')
                }
            }
        });
    }
    if (getFileName() == "admin.html") {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "sessiontest",
            },
            dataType: "json",
            success: function(data) {
                if (data["uname"] != "admin") {
                    location.href = "login.html";
                }
            }
        });
    }
    console.log(getParam("key"))
    if (getParam("key") != '') {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "searchrules",
                key: getParam("key")
            },
            dataType: "json",
            success: function(data) {

                setSearchRules(data);
            }
        });
    }

    $($(".fa-search").parent()).click(function() {
        var key = $($($(this).parent()).siblings()).val();
        console.log(key)
        if (key != '') {
            location.href = "search.html?key=" + key;
        }
    });
    $($(".fa-sign-out").parent()).click(function() {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "sessionclean",
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
            }
        });
    })

    if (getFileName() == "login.html") {
        $("#login").click(function() {
            if ($("#username").val() == "" || $("#password").val() == "") {
                alert("用户名或密码错误");
                return;
            }
            $.ajax({
                type: "POST",
                url: "../controller/index.php",
                data: {
                    func: "login",
                    username: $("#username").val(),
                    password: $("#password").val()
                },
                dataType: "json",
                success: function(data) {
                    if (data["status"]) {
                        location.href = "index.html"
                        if ($("#username").val() == "admin") {
                            location.href = "admin.html"
                        }
                    } else {
                        alert("用户名或密码错误");
                    }
                }
            });
        });
    } else {
        $.ajax({
            type: "POST",
            url: "../controller/index.php",
            data: {
                func: "sessiontest",
            },
            dataType: "json",
            success: function(data) {
                if (data["status"] == false) {
                    location.href = "login.html";
                } else {
                    // if(data["uname"]=="admin"&&getFileName()!="admin.html")
                    // {
                    //     location.href = "admin.html";
                    // }
                    $(".myself").text(data["uname"])
                }
            }
        });
    }

    for (var i = 1; i < 10; i++) {
        if (getFileName() == "f" + i + ".html") {
            $.ajax({
                type: "POST",
                url: "../controller/index.php",
                data: {
                    func: "loadrules",
                    flow: i
                },
                dataType: "json",
                success: function(data) {
                    setRules(data);
                }
            });
        }
    }

    $($(".fa-plus").parent(".btn")).click(function() {
        var s = getNum(getFileName());
        // console.log($(".addrule").length);
        if ($(".addrule").length == 0)
            $($(this).parent()).append('<input type="text" class="form-control addrule" placeholder="请输入规则" required><button type="button" class="btn btn-outline btn-success confirm-add">确认添加</button>')
        else {
            $(".addrule").remove();
            $(".confirm-add").remove();
        }
        $(".confirm-add").click(function() {
            if ($(".addrule").val() != "") {
                $.ajax({
                    type: "POST",
                    url: "../controller/index.php",
                    data: {
                        func: "addrules",
                        flow: s,
                        rule: $(".addrule").val()
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data["status"]) {
                            // alert("添加成功"); 
                            location.reload();
                        }
                    }
                });
            }
        });

    })

})
