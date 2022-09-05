$("#queryAllBtn").click(async () => {
    $.get('/bicycles', (data, status) => {
        console.log(data, status);
        displayData(data, "GetAll");
    });
    navbarHider();
    $("#closeQueryModal").click();
});

$("#queryAbandonedBtn").click(async () => {
    $.get('/bicycles?abandoned=true', {}, (data, status) => {
        console.log(data, status);
        displayData(data, "GetAbandoned");
    });
    navbarHider();
    $("#closeQueryModal").click();
});

$("#queryAbandonedBtnMain").click(async () => {
    $.get('/bicycles?abandoned=true', {}, (data, status) => {
        console.log(data, status);
        displayData(data, "GetAbandoned");
    });
    navbarHider();
    $("#closeQueryModal").click();
});

$("#queryHistoryBtn").click(async () => {
    const bicycleId = $("#bicycleIdQuery").val();
    if (!bicycleId) {
        alert("input bicycle id!!");
        return;
    }
    await $.get(`/bicycles/${bicycleId}/history`, (data, status) => {
        displayData(data, "History");
    });
    navbarHider();
    $("#queryModal").modal('toggle');
});

$("#queryBtn").click(() => {
    const bicycleId = $("#bicycleIdQuery").val();
    console.log(bicycleId);
    if (!bicycleId) {
        alert("input bicycle id!!");
        return;
    }
    $.get(`/bicycles/${bicycleId}`, (data, status) => {
        displayData(data, "Get");
    });
    navbarHider();
    $("#queryModal").modal('toggle');
});

$("#queryMineBtn").click(() => {
    $('.navbar-toggler').click();
    let getData = {};
    $.get(apiStubAddr, getData, (data, status) => {
        console.log(status);
        console.log(data);
    });
    navbarHider();
    $("#queryModal").modal('toggle');
});