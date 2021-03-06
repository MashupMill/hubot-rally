module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "8.12.0" } }]
    ],
    plugins: [
        "@babel/plugin-transform-async-to-generator"
    ],
    env: {
        test: {
            plugins: ["istanbul"]
        }
    }
};
