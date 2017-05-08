const SHAPE = (function () {
    const my = {};

    function addMeshVertices(V, m, n, func) {
        function append(A) {
            for (let i = 0; i < A.length; i++) {
                V.push(A[i]);
            }
        }

        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) {
                const A = func(i / m, j / n);
                const B = func((i + 1) / m, j / n);
                const C = func(i / m, (j + 1) / n);
                const D = func((i + 1) / m, (j + 1) / n);
                append(A);
                append(B);
                append(D); // Lower right of square.
                append(D);
                append(C);
                append(A); // Upper left of square.
            }
        }
        return V;
    }

    function addDiskVertices(V, n, zSign, z) {
        function f(i) {
            const theta = zSign * 2 * Math.PI * i / n;
            V.push(Math.cos(theta), Math.sin(theta), z, 0, 0, zSign, 0, 0);
        }

        for (let i = 0; i < n; i++) {
            f(i);
            f(i + 1);
            V.push(0, 0, z, 0, 0, zSign, 0, 0);
        }
        return V;
    }

    function addTubeVertices(V, n) {
        return addMeshVertices(V, n, 1, function (u, v) {
            const theta = 2 * Math.PI * u;
            const z = 2 * v - 1;
            let c = Math.cos(theta);
            let s = Math.sin(theta);
            return [c, s, z, c, s, 0, u, v];
        });
    }

    /* 0 stays constant, phi switches sign each time, 1 switches sign every 2.
     0: [0,  1,  phi],   4: [ 1,  phi, 0],   8: [ phi, 0,  1],
     1: [0,  1, -phi],   5: [ 1, -phi, 0],   9: [-phi, 0,  1],
     2: [0, -1,  phi],   6: [-1,  phi, 0],   10:[ phi, 0, -1],
     3: [0, -1, -phi],   7: [-1, -phi, 0],   11:[-phi, 0, -1]*/
    function icos(i, j) {
        const phi = (1 + Math.sqrt(5)) / 2;
        let phi1 = (j % 2 === 0) ? phi : -phi;
        let one = (j < 2) ? 1 : -1;

        switch (i) {
            case 0:
                return [0, one, phi1];
            case 1:
                return [one, phi1, 0];
            case 2:
                return [phi1, 0, one];
        }
    }

    my.cylinder = function (n) {
        const V = [];
        addDiskVertices(V, n, -1, -1);
        addTubeVertices(V, n);
        addDiskVertices(V, n, 1, 1);
        return V;
    };

    my.unitCube = function () {
        const cubeV = [
            [1, 1, 1],
            [1, 1, -1],
            [1, -1, 1],
            [1, -1, -1],

            [-1, 1, 1],
            [-1, 1, -1],
            [-1, -1, 1],
            [-1, -1, -1],
        ];

        return [
            [cubeV[0], cubeV[1], cubeV[3], cubeV[2]],
            [cubeV[0], cubeV[1], cubeV[5], cubeV[4]],
            [cubeV[0], cubeV[2], cubeV[6], cubeV[4]],

            [cubeV[1], cubeV[3], cubeV[7], cubeV[5]],

            [cubeV[2], cubeV[3], cubeV[7], cubeV[6]],
            [cubeV[4], cubeV[5], cubeV[7], cubeV[6]]
        ];
    };

    my.unitDodecahedron = function () {
        const phi = (1 + Math.sqrt(5)) / 2;

        const dodecV = [
            // orange vertices (0-7)
            [1, 1, 1],
            [1, 1, -1],
            [1, -1, 1],
            [1, -1, -1],

            [-1, 1, 1],
            [-1, 1, -1],
            [-1, -1, 1],
            [-1, -1, -1],

            // green vertices (8-11)
            [0, phi, 1 / phi],
            [0, phi, -1 / phi],
            [0, -phi, 1 / phi],
            [0, -phi, -1 / phi],

            // blue vertices (12-15)
            [1 / phi, 0, phi],
            [-1 / phi, 0, phi],
            [1 / phi, 0, -phi],
            [-1 / phi, 0, -phi],

            // pink vertices (16-19)
            [phi, 1 / phi, 0],
            [phi, -1 / phi, 0],
            [-phi, 1 / phi, 0],
            [-phi, -1 / phi, 0],
        ];

        return [
            /* Face 1 */ [dodecV[0], dodecV[12], dodecV[2], dodecV[17], dodecV[16]],
            /* Face 2 */ [dodecV[0], dodecV[8], dodecV[9], dodecV[1], dodecV[16]],
            /* Face 3 */ [dodecV[0], dodecV[8], dodecV[4], dodecV[13], dodecV[12]],

            /* Face 4 */ [dodecV[1], dodecV[16], dodecV[17], dodecV[3], dodecV[14]],
            /* Face 5 */ [dodecV[1], dodecV[9], dodecV[5], dodecV[15], dodecV[14]],

            /* Face 6 */ [dodecV[2], dodecV[12], dodecV[13], dodecV[6], dodecV[10]],
            /* Face 7 */ [dodecV[2], dodecV[10], dodecV[11], dodecV[3], dodecV[17]],

            /* Face 8 */ [dodecV[3], dodecV[14], dodecV[15], dodecV[7], dodecV[11]],

            /* Face 9 */ [dodecV[4], dodecV[18], dodecV[5], dodecV[9], dodecV[8]],
            /* Face 10 */[dodecV[4], dodecV[13], dodecV[6], dodecV[19], dodecV[18]],

            /* Face 11 */[dodecV[5], dodecV[18], dodecV[19], dodecV[7], dodecV[15]],

            /* Face 12 */[dodecV[6], dodecV[19], dodecV[7], dodecV[11], dodecV[10]]
        ];
    };


    my.unitIcosahedron = function () {
        const icosV = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                icosV.push(icos(i, j));
            }
        }

        return [
            [icosV[0], icosV[2], icosV[8]],  // Face 1
            [icosV[0], icosV[8], icosV[4]],  // Face 2
            [icosV[0], icosV[4], icosV[6]],  // Face 3
            [icosV[0], icosV[6], icosV[9]],  // Face 4
            [icosV[0], icosV[9], icosV[2]],  // Face 5
            [icosV[2], icosV[7], icosV[5]],  // Face 6
            [icosV[2], icosV[5], icosV[8]],  // Face 7
            [icosV[2], icosV[9], icosV[7]],  // Face 8
            [icosV[8], icosV[5], icosV[10]], // Face 9
            [icosV[8], icosV[10], icosV[4]], // Face 0
            [icosV[10], icosV[5], icosV[3]], // Face 11
            [icosV[10], icosV[3], icosV[1]], // Face 12
            [icosV[10], icosV[1], icosV[4]], // Face 13
            [icosV[1], icosV[6], icosV[4]],  // Face 14
            [icosV[1], icosV[3], icosV[11]], // Face 15
            [icosV[1], icosV[11], icosV[6]], // Face 16
            [icosV[6], icosV[11], icosV[9]], // Face 17
            [icosV[11], icosV[3], icosV[7]], // Face 18
            [icosV[11], icosV[7], icosV[9]], // Face 19
            [icosV[3], icosV[5], icosV[7]]   // Face 20
        ];
    };

    my.unitOctahedron = function () {
        const octaV = [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
        ];

        return [
            [octaV[0], octaV[2], octaV[4]],
            [octaV[0], octaV[2], octaV[5]],
            [octaV[0], octaV[3], octaV[4]],
            [octaV[0], octaV[3], octaV[5]],

            [octaV[1], octaV[2], octaV[4]],
            [octaV[1], octaV[2], octaV[5]],
            [octaV[1], octaV[3], octaV[4]],
            [octaV[1], octaV[3], octaV[5]],
        ];
    };

    my.unitTetrahedron = function() {
        const s = 1 / Math.sqrt(2);
        const tetraV = [
            [1,0,-s],
            [-1,0,-s],
            [0,1,s],
            [0,-1,s],
        ];

        return [
            [tetraV[0], tetraV[1], tetraV[2]],
            [tetraV[0], tetraV[1], tetraV[3]],
            [tetraV[0], tetraV[2], tetraV[3]],
            [tetraV[1], tetraV[2], tetraV[3]]
        ];
    };

    return my;
})();

