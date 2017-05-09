const shaders = function() {
    const my = {};

    // Vertex shader that we use for everything.
    my.vs_script = 'attribute vec3 aPos, aNor;\n\
attribute vec2 aUV;\n\
varying   vec3 vPos, vNor;\n\
varying   vec2 vUV;\n\
uniform   mat4 matrix, invMatrix;\n\
void main() {\n\
    vec4 pos = matrix * vec4(aPos, 1.);\n\
    vec4 nor = vec4(aNor, 0.) * invMatrix;\n\
    gl_Position = pos;\n\
    vPos = pos.xyz;\n\
    vNor = nor.xyz;\n\
    vUV  = aUV;\n\
}\n';

    // The structure that makes up our malleable fragment shader script
    const defaultX = '.8';
    const defaultY = '.8';
    const defaultZ = '.2';
    let lightDir = defaultX + ',' + defaultY + ',' + defaultZ;
    const fs_script_malleable_no_texture_p1 = 'varying vec3 vPos, vNor;\n\
void main() {\n\
   vec3 normal = normalize(vNor);\n\
   vec3 c = normal * .5 + .5;\n\
\n\
   /* Begin Phong Shading. */\n\
   vec3 L = normalize(vec3(';
    const fs_script_malleable_no_texture_p2 = '));     // Light\n\
   vec3 Lcol = vec3(.8, .5, .8);        // Light Color\n\
   vec3 R = 2. * normal * dot(normal, L) - L;   // R\n\
\n\
   vec3 a = vec3(.2, 0,.2); // ambient\n\
   vec3 d = vec3(.5,.4,.5); // diffuse\n\
   vec3 s = vec3(.3,.2,.3); // specular\n\
   vec3 E = normalize(-L);  // direction back\n\
\n\
   c = a + Lcol *\n\
       (d * max(0., dot(normal, L)) +\n\
       s * pow(max(0., dot(E, R)), 2.5));\n\
   /* End Phong Shading. */\n\
   gl_FragColor = vec4(sqrt(c), 1.);\n\
}\n';

    my.fs_script_malleable_no_texture = fs_script_malleable_no_texture_p1 + lightDir
        + fs_script_malleable_no_texture_p2;

    my.fs_script_texture_supported = '\n\
varying vec3 vPos, vNor;\n\
varying vec2 vUV;\n\
uniform sampler2D uSampler;\n\
void main() {\n\
    vec3 normal = normalize(vNor);\n\
    vec3 c = normal * .5 + .5;\n\
\n\
    /* Begin Phong Shading. */\n\
    vec3 L = normalize(vec3(.8,.8,.2));     // Light\n\
    vec3 Lcol = vec3(.8, .5, .8);        // Light Color\n\
    vec3 R = 2. * normal * dot(normal, L) - L;   // R\n\
\n\
    vec3 a = vec3(.2, 0,.2); // ambient\n\
    vec3 d = vec3(.5,.4,.5); // diffuse\n\
    vec3 s = vec3(.3,.2,.3); // specular\n\
    vec3 E = normalize(-L);  // direction back\n\
\n\
    c = a + Lcol *\n\
        (d * max(0., dot(normal, L)) +\n\
        s * pow(max(0., dot(E, R)), 2.5));\n\
    /* End Phong Shading. */\n\
    vec4 texture = texture2D(uSampler, vUV);\n\
    c += 0.2 * texture.rgb;\n\
    gl_FragColor = vec4(sqrt(c), 1.);\n\
}\n';

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


    function updateMaterials(canvas, scene, event) {
        console.log('mouse down event', event);

        // Update the malleable scripts
        const coordinates = getMousePos(canvas, event);
        const x = coordinates.x;
        const y = coordinates.y;
        lightDir = '' + x + ', ' + y + ', ' + defaultZ;
        my.fs_script_malleable_no_texture = fs_script_malleable_no_texture_p1 + lightDir
            + fs_script_malleable_no_texture_p2;

        // Update the materials for the scripts.
        scene.objects.forEach((sceneObj) => {
            const fs = sceneObj.material.fs;
            if (!(fs.includes('texture'))) {
                const material = new Material(my.vs_script, my.fs_script_malleable_no_texture);
                sceneObj.setMaterial(material);
            }
        });
    }

    function updateCanvas(scene) {
        const canvas1 = document.querySelector('#canvas1');
        canvas1.addEventListener('mousedown', function(event) {
            updateMaterials(this, scene, event);
        });
    }

    // Facilitate malleable fragment shaders, but only do it here so as to keep the scripts structured.
    my.updateMaterialsOnMouseDown = function(scene) {
        window.addEventListener('DOMContentLoaded', updateCanvas.bind(null, scene));
    };

    return my;
}();
