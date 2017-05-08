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

    my.unitIcosahedron = function () {
        const v = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                v.push(icos(i, j));
            }
        }

        return [
            [v[0], v[2], v[8]],  // Face 1
            [v[0], v[8], v[4]],  // Face 2
            [v[0], v[4], v[6]],  // Face 3
            [v[0], v[6], v[9]],  // Face 4
            [v[0], v[9], v[2]],  // Face 5
            [v[2], v[7], v[5]],  // Face 6
            [v[2], v[5], v[8]],  // Face 7
            [v[2], v[9], v[7]],  // Face 8
            [v[8], v[5], v[10]], // Face 9
            [v[8], v[10], v[4]], // Face 0
            [v[10], v[5], v[3]], // Face 11
            [v[10], v[3], v[1]], // Face 12
            [v[10], v[1], v[4]], // Face 13
            [v[1], v[6], v[4]],  // Face 14
            [v[1], v[3], v[11]], // Face 15
            [v[1], v[11], v[6]], // Face 16
            [v[6], v[11], v[9]], // Face 17
            [v[11], v[3], v[7]], // Face 18
            [v[11], v[7], v[9]], // Face 19
            [v[3], v[5], v[7]]   // Face 20
        ];
    };


    return my;
})();

