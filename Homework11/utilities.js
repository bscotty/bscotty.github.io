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
    const normal = [0,0,0];
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