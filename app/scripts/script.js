let loggedIn = false;

// define simple util functions
function navbarHandler() {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
}

function checkLogin() {
    if (loggedIn) {
        $("#loginMenu").addClass("d-none");
        $("#signupMenu").addClass("d-none");
        $("#logoutMenu").removeClass("d-none");
    } else {
        $("#loginMenu").removeClass("d-none");
        $("#signupMenu").removeClass("d-none");
        $("#logoutMenu").addClass("d-none");
    }
    // TODO:localStorage cookie or session 활용해서 받아오는 형식으로 변경한다.
}
checkLogin();

// Dynamically loads modelName according to company-name
$("#companyName").change(() => {
    console.log("company changed log from event handler jquery");
    let companyName = $("#companyName").val();
    $("#modelName").empty();
    $("#modelName").append('<option selected>모델명을 선택하세요</option>');
    ["MTB", "Cycle", "Electric", "BMX", "Hybrid"].forEach(type => {
        let dataString = `${companyName}.${type}`;
        $("#modelName").append(`<option value="${dataString}">${dataString}</option>`);
    });
});

// Event Listeners using jquery Syntax
$("#registerBtn").click(async () => {
    $('.navbar-toggler').click();
    const Owner = $("#ownerId").val();
    const Key = $("#bicycleId").val();
    const Company = $("#companyName").val();
    const Model = $("#modelName").val();
    const Colour = $("#colour").val();
    const Image = "";// $("#bicycleImg").val();
    const Comment = $("#comment").val();
    const Location = $("#location").val();
    const Abandoned = "false";
    const Surrendered = "false";
    // TODO : SERVER API CONNECTION

    await $.post('/bicycles', {
        Key: Key,
        Owner: Owner,
        Company: Company,
        Model: Model,
        Colour: Colour,
        Image: Image,
        Comment: Comment,
        Location: Location,
        Abandoned: Abandoned,
        Surrendered: Abandoned,
    }, (data, status) => {
        console.log("post to /bicycles successful");
        console.log(status);
        console.log(data);
        displayData(data, "Set");
    });

    $("#registerModal").modal('toggle');

    console.log("registerBtn Clicked");
});


$("#loginBtn").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    $('.navbar-toggler').click();
    const loginId = $("#loginId").val();
    const loginPw = $("#loginPw").val();
    let postData = {
        loginId: loginId,
        loginPw: loginPw
    };
    await $.post(apiStubAddr, postData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "login");
    });
    console.log("login btn triggered");
    checkLogin();
    $("#loginModal").modal('toggle');
});


$("#reportBtn").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    const Key = $("#bicycleIdForChange").val();
    const Mode = $("#reportMode").val();;
    console.log(Mode);
    console.log("post to /bicycles/state successful");
    await $.post('/bicycles/state', {
        Key: Key,
        Mode: Mode,
    }, (data, status) => {
        console.log("post to /bicycles/state successful");
        displayData(data, "SetState");
    });
    $("#changeModal").modal('toggle');
});

$("#logoutMenu").click(() => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    loggedIn = false;
    checkLogin();
});


$("#createUserWallet").click(async () => {
    let postData = {};
    await $.post('/userWallet', postData, (data, status) => {
        console.log(status);
        console.log(data);
        $("#debugResult").empty();
        $("#debugResult").append("<p>" + JSON.stringify(data) + "</p>");
    });
});

// show loading wheel when ajaxing
$(document).on({
    ajaxStart: function () {
        console.log("ajaxStart");
        $('#cover-spin').show(0);
    },
    ajaxStop: function () {
        console.log("ajaxEnd");
        $('#cover-spin').show(1);
    }
});

// Event Listeners for debugging
$("#changeLoginStatus").click(() => {
    loggedIn = loggedIn ? false : true;
    checkLogin();
});
