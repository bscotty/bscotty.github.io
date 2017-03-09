let startTime = Date.now() / 1000, time = startTime;

function draw2DCanvases(canvases) {
    for (let i = 0; i < canvases.length; i++)
        trackCursor(canvases[i]);
    setInterval(function () {
        let i, canvas, context;
        time = Date.now() / 1000 - startTime;
        for (i = 0; i < canvases.length; i++)
            if ((canvas = canvases[i]).update) {
                context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.update(context);
            }
    }, 30);
}

function trackCursor(canvas) {
    canvas.cursor = {x: 0, y: 0, z: 0};
    canvas.setCursor = function (x, y, z) {
        let r = this.getBoundingClientRect();
        this.cursor.x = x - r.left;
        this.cursor.y = y - r.top;
        if (z !== undefined)
            this.cursor.z = z;
    };
    canvas.onmousedown = function (e) {
        this.setCursor(e.clientX, e.clientY, 1);
    };
    canvas.onmousemove = function (e) {
        this.setCursor(e.clientX, e.clientY);
    };
    canvas.onmouseup = function (e) {
        this.setCursor(e.clientX, e.clientY, 0);
    };
}
