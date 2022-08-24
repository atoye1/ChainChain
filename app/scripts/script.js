const loginBtn = $("#loginBtn");
const signupBtn = $("#signupBtn");
const logoutBtn = $("#logoutBtn");
const modelName = $("#modelName");
const apiStubAddr = "https://reqres.in/api/users";
const serverAddr = "";
let loggedIn = false;

function checkLogin() {
    if (loggedIn) {
        $("#loginMenu").addClass("d-none");
        $("#logoutMenu").removeClass("d-none");
    } else {
        $("#loginMenu").removeClass("d-none");
        $("#logoutMenu").addClass("d-none");
    }
    // TODO:localStorage cookie or session 활용해서 받아오는 형식으로 변경한다.
}

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

// show loading wheel when ajaxing


$("#registerBtn").click(async () => {
    const ownerId = $("#ownerId").val();
    const bicycleId = $("#bicycleId").val();
    const companyName = $("#companyName").val();
    const modelName = $("#modelName").val();
    const colour = $("#colour").val();
    const bicycleImg = $("#bicycleImg").val();
    const textComment = $("#textComment").val();
    let postData = {
        ownerId: ownerId,
        bicycleId: bicycleId,
        companyName: companyName,
        modelName: modelName,
        colour: colour,
        bicycleImg: bicycleImg,
        textComment: textComment,
    };
    console.log(postData);

    // TODO : SERVER API CONNECTION
    await $.post(apiStubAddr, postData, (data, status) => {
        console.log(status);
        console.log(data);
    });
    console.log("registerBtn Clicked");
});

$("#queryBtn").click(() => {
    const bicycleIdQuery = $("#bicycleIdQuery").val();
    let getData = {
        bicycleIdQuery: bicycleIdQuery
    };
    console.log(bicycleIdQuery);
    $.get(apiStubAddr, getData, (data, status) => {
        console.log(status);
        console.log(data);
    });
});

$("#queryMineBtn").click(() => {
    let getData = {};
    $.get(apiStubAddr, getData, (data, status) => {
        console.log(status);
        console.log(data);
    });
});

loginBtn.click(() => {

});

signupBtn.click(() => {

});


$(document).on({
    ajaxStart: function () {
        console.log("ajaxStart");
        $("#loading_modal").modal('show');
    },
    ajaxStop: function () {
        console.log("ajaxEnd");
        $("#loading_modal").modal('hide');
    }
});;;




//
checkLogin();