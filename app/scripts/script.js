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
    if (mode === "register") {
        resultSection.append('<h1>' + "register mode" + '</h1>');
    } else if (mode === "query") {
        resultSection.append('<h1>' + "Query mode" + '</h1>');
    } else if (mode === "queryHistory") {
        console.log("------배열데이터------");
        console.log(data);
        resultSection.append('<h1>' + "Query History mode" + '</h1>');
    } else if (mode === "login") {
        resultSection.append('<h1>' + "login mode" + '</h1>');
    } else {
        resultSection.append('<h1>' + "으잉?" + '</h1>');
        resultSection.append('<p>' + "표시할 내용이 업습니다." + '</p>');
    }
    if (data) {
        resultSection.append('<p>' + JSON.stringify(data) + '</p>');
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
    const ownerId = $("#ownerId").val();
    const bicycleId = $("#bicycleId").val();
    const companyName = $("#companyName").val();
    const modelName = $("#modelName").val();
    const colour = $("#colour").val();
    const bicycleImg = $("#bicycleImg").val();
    const textComment = $("#textComment").val();
    // TODO : SERVER API CONNECTION

    await $.post('/bicycle', {
        bicycleId: bicycleId,
        ownerId: ownerId,
        companyName: companyName,
        modelName: modelName,
        colour: colour,
        bicycleImg: bicycleImg,
        textComment: textComment,
    }, (data, status) => {
        console.log("post to /bicycle successful");
        console.log(status);
        console.log(data);
        displayData(data, "register");
    });
    $("#registerModal").modal('toggle');
    console.log("registerBtn Clicked");
});

$("#queryBtn").click(() => {
    const bicycleIdQuery = $("#bicycleIdQuery").val();
    let getData = {
        bicycleIdQuery: bicycleIdQuery
    };
    let queryEndpoint = "/bicycle";
    console.log(bicycleIdQuery);
    $.get('/bicycle', getData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "query");
    });
    $("#queryModal").modal('toggle');
});

$("#queryHistoryBtn").click(() => {
    const bicycleIdQuery = $("#bicycleIdQuery").val();
    let getData = {
        bicycleIdQuery: bicycleIdQuery
    };
    $.get('/bicycle/history', getData, (data, status) => {
        console.log(status);
        console.log(data);
        displayData(data, "queryHistory");
    });
    $("#queryModal").modal('toggle');
});

$("#queryMineBtn").click(() => {
    let getData = {};
    $.get(apiStubAddr, getData, (data, status) => {
        console.log(status);
        console.log(data);
    });
    $("#queryModal").modal('toggle');
});

$("#loginBtn").click(async () => {
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
$("#queryDesertedMenu").click(async () => {
    $.get('/bicycle/deserted', {}, (data, status) => {
        console.log(data, status);
        displayData(data);
    });
    // TODO: folding unfolded menu 
});
$("#queryDesertedBtn").click(async () => {
    $.get('/bicycle/deserted', {}, (data, status) => {
        console.log(data, status);
        displayData(data);
    });
});



signupBtn.click(() => {

});

$("#logoutMenu").click(() => {
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
        $("#loading_modal").modal('show');
    },
    ajaxStop: function () {
        console.log("ajaxEnd");
        $("#loading_modal").modal('hide');
    }
});

// Event Listeners for debugging
$("#changeLoginStatus").click(() => {
    loggedIn = loggedIn ? false : true;
    checkLogin();
});