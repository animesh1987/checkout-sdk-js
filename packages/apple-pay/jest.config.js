module.exports = {
    displayName: "apple-pay",
    preset: "../../jest.preset.js",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json",
        },
    },
    setupFilesAfterEnv: ['../../jest-setup.js'],
    coverageDirectory: "../../coverage/packages/apple-pay",
};
