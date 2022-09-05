const landingSection = $("#landing");
const resultSection = $("#result");

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