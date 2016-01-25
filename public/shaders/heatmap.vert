precision highp float;

attribute vec2 aPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

varying vec2 vTextureCoord;

void main() {
    // set texture coordinates
    vTextureCoord = aTextureCoord;
    // set position
    gl_Position = uProjectionMatrix * uModelMatrix * vec4( aPosition, 0.0, 1.0 );
}
