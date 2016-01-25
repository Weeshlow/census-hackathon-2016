precision highp float;

uniform sampler2D uTextureSampler;
uniform float uOpacity;
uniform float uMin;
uniform float uMax;
uniform vec4 uColorRampFrom;
uniform vec4 uColorRampTo;

varying vec2 vTextureCoord;

float decodeFloatRGBA( vec4 rgba ) {
    return 16777216.0 * ( 255.0 * rgba.r ) +
        65536.0 * ( 255.0 * rgba.g ) +
        256.0 * ( 255.0 * rgba.b ) +
        1.0 * ( 255.0 * rgba.a );
}

float log10(float v) {
    return log(v) / log(10.0);
}

float transformValue(float value) {
    float clampedMin = max(uMin, 1.0);
    float clampedMax = max(uMax, 1.0);
    float clamped = max(min(value, clampedMax), clampedMin);
    float logMin = log10(clampedMin);
    float logMax = log10(clampedMax);
    float diff = logMax - logMin;
    float oneOverLogRange = 1.0 / diff;
    return (log10(clamped) - logMin) * oneOverLogRange;
}

vec4 interpolateColor(float value) {
    float alpha = transformValue(value);
    if (value == 0.0) {
        return vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        return vec4(
            uColorRampTo.r * alpha + uColorRampFrom.r * (1.0 - alpha),
            uColorRampTo.g * alpha + uColorRampFrom.g * (1.0 - alpha),
            uColorRampTo.b * alpha + uColorRampFrom.b * (1.0 - alpha),
            uColorRampTo.a * alpha + uColorRampFrom.a * (1.0 - alpha)
        );
    }
}

void main() {
    // read bin from tile texture
    vec4 bin = texture2D(uTextureSampler, vTextureCoord);
    // extract count from rgba components
    float count = decodeFloatRGBA(bin);
    // interpolate based on color ramp
    vec4 color = interpolateColor(count);
    // multiply alpha by opacity
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
}
