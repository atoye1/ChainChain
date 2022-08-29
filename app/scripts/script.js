const loginBtn = $("#loginBtn");
const signupBtn = $("#signupBtn");
const logoutBtn = $("#logoutBtn");
const modelName = $("#modelName");
const apiStubAddr = "https://reqres.in/api/users";
const serverAddr = "";

const landingSection = $("#landing");
const resultSection = $("#result");
let loggedIn = false;

function displayData(data, mode) {
    landingSection.addClass("d-none");
    resultSection.empty();
    resultSection.removeClass("d-none");
    if (mode === "Set") {
        resultSection.append('<h1>' + "register mode" + '</h1>');
        resultSection.append('<h1>' + JSON.stringify(data) + '</h1>');
        console.log("set mode result");
    } else if (mode === "Get") {
        resultSection.append('<h1>' + "Query mode" + '</h1>');
        resultSection.append('<h1>' + JSON.stringify(data) + '</h1>');
    } else if (mode === "History") {
        console.log("------배열데이터------");
        console.log(data);
        resultSection.append('<h1>' + "Query History mode" + '</h1>');
        resultSection.append('<div id="cardsContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 px-lg-5 justify-content-center"></div>');
        // resultSection.append('<h1>' + JSON.stringify(data) + '</h1>');
        data.forEach(e => {
            let bgColor = e.record.Abandoned === "true" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)";
            let imagePath = e.record.Image === "" ? "no_image_available.jpeg" : e.record.Image;
            $("#cardsContainer").append(
                `<div class="col mb-4 mx-3">
                    <div class="card" style="background-color:${bgColor}">
                        <img src="../static/img/${imagePath}" style="height:45vh" class="img-thumbnail img-fluid card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fa-solid fa-key"> Bicycle ID</i><span style="display:inline-block; width:95%; text-align:right;">${e.record.Key}</span></h5>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-person"> Owner </i><span style="display:inline-block; width:95%; text-align:right;">${e.record.Owner}</span></p>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-building"> Company </i><span style="display:inline-block; width:95%; text-align:right;">${e.record.Company}</span></p>
                            <hr>
                            <p class="card-text"><i class="fa-solid fa-bicycle"> Model </i><span style="display:inline-block; width:95%; text-align:right;">${e.record.Model}</span></p>
                        </div>
                    </div>
                </div>`);
        });
    } else if (mode === "login") {
        resultSection.append('<h1>' + "login mode" + '</h1>');
    } else if (mode === "GetAbandoned") {
        resultSection.append('<div id="cardsContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 px-lg-5 justify-content-center"></div>');
        data.forEach(e => {
            let bgColor = e.Abandoned === "true" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)";
            let imagePath = e.Image === "" ? "no_image_available.jpeg" : e.Image;
            $("#cardsContainer").append(
                `<div class="col mb-4 mx-3">
                    <div class="card" style="background-color:${bgColor}">
                        <img src="../static/img/${imagePath}" style="height:45vh" class="img-thumbnail img-fluid card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fa-solid fa-key"> Bicycle ID</i><span style="display:inline-block; width:95%; text-align:right;">${e.Key}</span></h5>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-person"> Owner </i><span style="display:inline-block; width:95%; text-align:right;">${e.Owner}</span></p>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-building"> Company </i><span style="display:inline-block; width:95%; text-align:right;">${e.Company}</span></p>
                            <hr>
                            <p class="card-text"><i class="fa-solid fa-bicycle"> Model </i><span style="display:inline-block; width:95%; text-align:right;">${e.Model}</span></p>
                        </div>
                    </div>
                </div>`);
        });
    } else if (mode === "GetAll") {
        resultSection.append('<div id="cardsContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 px-lg-5 justify-content-center"><hdiv>');
        data.forEach(e => {
            let imagePath = e.Image === "" ? "no_image_available.jpeg" : e.Image;
            let bgColor = e.Abandoned === "true" ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)";
            $("#cardsContainer").append(
                `<div class="col mb-4 mx-3">
                    <div class="card" style="background-color:${bgColor}">
                        <img src="../static/img/${imagePath}" style="height:45vh" class="img-thumbnail img-fluid card-img-top h-330" alt="...">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fa-solid fa-key"> Bicycle ID</i><span style="display:inline-block; width:95%; text-align:right;">${e.Key}</span></h5>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-person"> Owner </i><span style="display:inline-block; width:95%; text-align:right;">${e.Owner}</span></p>
                            <hr>
                            <p class="card-text"> <i class="fa-solid fa-building"> Company </i><span style="display:inline-block; width:95%; text-align:right;">${e.Company}</span></p>
                            <hr>
                            <p class="card-text"><i class="fa-solid fa-bicycle"> Model </i><span style="display:inline-block; width:95%; text-align:right;">${e.Model}</span></p>
                        </div>
                    </div>
                </div>`);
        });
    }
    // if (data) {
    //     resultSection.append('<h4>' + "Displaying Data for Debugging" + '</h4>');
    //     resultSection.append('<p>' + JSON.stringify(data) + '</p>');
    // }
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

    await $.post('/bicycle', {
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
        console.log("post to /bicycle successful");
        console.log(status);
        console.log(data);
        displayData(data, "Set");
    });

    $("#registerModal").modal('toggle');

    console.log("registerBtn Clicked");
});

$("#queryBtn").click(() => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    const bicycleIdQuery = $("#bicycleIdQuery").val();
    let getData = {
        bicycleIdQuery: bicycleIdQuery
    };
    let queryEndpoint = "/bicycle";
    console.log(bicycleIdQuery);
    $.get('/bicycle', getData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "Get");
    });
    $("#queryModal").modal('toggle');
});

$("#queryHistoryBtn").click(() => {

    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    const bicycleIdQuery = $("#bicycleIdQuery").val();
    let getData = {
        bicycleIdQuery: bicycleIdQuery
    };
    $.get('/bicycle/history', getData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "History");
    });
    $("#queryModal").modal('toggle');
});

$("#queryMineBtn").click(() => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    $('.navbar-toggler').click();
    let getData = {};
    $.get(apiStubAddr, getData, (data, status) => {
        console.log(status);
        console.log(data);
    });
    $("#queryModal").modal('toggle');
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

// Deserted Query : 방치된 자전거들 조회
$("#queryAbandonedBtn").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    $.get('/bicycle/abandoned', {}, (data, status) => {
        console.log(data, status);
        displayData(data, "GetAbandoned");
    });
    $("#closeQueryModal").click();
});
$("#queryAbandonedBtnMain").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    $.get('/bicycle/abandoned', {}, (data, status) => {
        console.log(data, status);
        displayData(data, "GetAbandoned");
    });
    $("#closeQueryModal").click();
});
$("#queryAllBtn").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    $.get('/bicycle/all', {}, (data, status) => {
        console.log(data, status);
        displayData(data, "GetAll");
    });
    $("#closeQueryModal").click();
});

$("#reportBtn").click(async () => {
    if ($("#navbarCollapse").hasClass('show')) {
        $('.navbar-toggler').click();
    }
    const Key = $("#bicycleIdForChange").val();
    const Mode = $("#reportMode").val();;
    console.log(Mode);
    console.log("post to /bicycle/state successful");
    await $.post('/bicycle/state', {
        Key: Key,
        Mode: Mode,
    }, (data, status) => {
        console.log("post to /bicycle/state successful");
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

$("#navbarCollapse").removeClass('show');