function addToScene(obj, material, vertices, scene) {
    const v = [];
    for (let i = 0; i < vertices.length; i++) {
        const polygon = vertices[i];
        for (let j = 0; j < (polygon.length - 2); j++) {
            const normal = calculateNormalFromPolygon(polygon);
            v.push(...polygon[0], ...normal, 1, -1);
            v.push(...polygon[j + 1], ...normal, 1, 1);
            v.push(...polygon[j + 2], ...normal, -1, 1);
        }
    }
    obj.setMaterial(material);
    obj.setVertices(v);
    scene.addObject(obj);
}

function calculateNormalFromPolygon(polygon) {
    const normal = [0, 0, 0];
    for (let i = 0; i < polygon.length; i++) {
        normal[0] += polygon[i][0];
        normal[1] += polygon[i][1];
        normal[2] += polygon[i][2];
    }
    normal[0] = normal[0] / polygon.length;
    normal[1] = normal[1] / polygon.length;
    normal[2] = normal[2] / polygon.length;

    return normal;
}

function decay(init, time) {
    return Math.max(0, init * Math.exp(-0.47 * time));
}

// Thanks to the following StackOverflow page for helping me get the correct position of the mouse.
// http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    // Scale mouse coordinates after they have been adjusted to be relative to element
    const x = ((event.clientX - rect.left) * scaleX);
    const y = ((event.clientY - rect.top) * scaleY);

    // Then, convert to the range we want, (-1, 1).
    return {
        x: (x / (rect.width / 2)) - 1,
        y: ((y / (rect.height / 2)) - 1) * -1
    }
}