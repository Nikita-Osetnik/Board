var canvas;
var context;
var isDrawing;

window.onload = function () {
    checkDesk();

    canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    context.strokeStyle = "white";

    canvas.onmousedown = startDrawing;
    canvas.onmouseup = stopDrawing;
    canvas.onmouseout = stopDrawing;
    canvas.onmousemove = draw;
};

function startDrawing(e) {
    isDrawing = true;

    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;

    writeToJSON("START", x / 1000, y / 500);
}

function draw(e) {
    if (isDrawing == true) {
        var x = (e.pageX - canvas.offsetLeft);
        var y = (e.pageY - canvas.offsetTop);

        writeToJSON("MOVE", x / 1000, y / 500);
    }
}

function stopDrawing() {
    isDrawing = false;
}

function writeToJSON(type, x, y) {
    var event = {
        type: type,
        x: x,
        y: y
    };

    $.ajax({
        url: "/board/api",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(event),
        contentType: "application/json"
    });
}

function drawJSON(data) {
    if (data.type == "START") {
        context.beginPath();
        context.moveTo(data.x * 1000, data.y * 500);
    }
    if (data.type == "MOVE") {
        context.lineTo(data.x * 1000, data.y * 500);
        context.stroke();
    }
}

function checkDesk() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) {
            return;
        }
        if (this.status == 200) {
            var points = JSON.parse(this.responseText);
            console.log(points);
            for (var i = 0; i < points.length; i++) {
                drawJSON(points[i]);
            }
        }
        checkDesk();
    };
    xhr.open("GET", "/board/api", true);
    xhr.send();
}
