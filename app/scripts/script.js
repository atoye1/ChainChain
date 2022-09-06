// define simple util functions
function navbarHider() {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
}

async function checkLogin() {
    let loggedIn = false;
    console.log("checkLogin() called");
    await $.get('/users/login', {}, (data, status) => {
        console.log("printing data below");
        console.log(data, status);
        // data = JSON.parse(data);
        loggedIn = data.loggedIn;
    });

    if (loggedIn) {
        $("#loginMenu").addClass("d-none");
        $("#signupMenu").addClass("d-none");
        $("#logoutMenu").removeClass("d-none");
    } else {
        $("#loginMenu").removeClass("d-none");
        $("#signupMenu").removeClass("d-none");
        $("#logoutMenu").addClass("d-none");
    }
    console.log("checkLogin() ended");
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
    const Owner = $("#ownerId").val();
    const Key = $("#bicycleId").val();
    const Company = $("#companyName").val();
    const Model = $("#modelName").val();
    const Colour = $("#colour").val();
    const ImageFile = await document.getElementById("file").files[0];
    const Comment = $("#comment").val();
    const Location = $("#location").val();
    const Abandoned = "false";
    const Surrendered = "false";
    let file = document.getElementById("file").files[0];
    if (ImageFile) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(ImageFile);
        reader.onload = (event) => {
            console.log("event", event);
            file = event.target.result;
            console.log("result", file);
        };
    }
    data = new FormData();
    data.append('file', file);
    data.append('Key', Key);
    console.log(data);
    await $.ajax({
        type: 'POST',
        enctype: 'mutipart/form-data',
        url: '/bicycles',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 60000,
        success: (data, status) => {
            console.log("post to /bicycles successful");
            console.log(status);
            console.log(data);
            displayData(data, "Set");
        },
        error: (e) => {
            console.log("Error: ", e);
            alert("failed");
        }
    });

    // await $.post('/bicycles', {
    //     Key: Key,
    //     Owner: Owner,
    //     Company: Company,
    //     Model: Model,
    //     Colour: Colour,
    //     ImageTitle: ImageFile.name,
    //     ImageFileBinary: ImageFileBinary,
    //     Comment: Comment,
    //     Location: Location,
    //     Abandoned: Abandoned,
    //     Surrendered: Abandoned,
    // }, (data, status) => {
    //     console.log("post to /bicycles successful");
    //     console.log(status);
    //     console.log(data);
    //     displayData(data, "Set");
    // });

    navbarHider();
    $("#registerModal").modal('toggle');

    console.log("registerBtn Clicked");
});


$("#loginBtn").click(async () => {
    $('.navbar-toggler').click();
    const loginId = $("#loginId").val();
    const loginPw = $("#loginPw").val();
    let postData = {
        loginId: loginId,
        loginPw: loginPw
    };
    console.log(postData);
    await $.post('/users/login', postData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "login");
    });
    console.log("login btn triggered");
    checkLogin();
    navbarHider();
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


$("#signupBtn").click(async () => {
    const signupId = $("#signupId").val();
    const signupPw = $("#signupPw").val();
    const signupRole = $("#signupRole").val();
    let postData = {
        signupId,
        signupPw,
        signupRole
    };
    console.log(postData);
    await $.post('/users', postData, (data, status) => {
        console.log(status);
        console.log(data);
        $("#debugResult").empty();
        $("#debugResult").append("<p>" + JSON.stringify(data) + "</p>");
    });
    navbarHider();
    $("#closeSignupModal").click();

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
