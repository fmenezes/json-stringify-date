/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1", // Map .js to real paths for ESM
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "tsconfig.jest.json", // Use specific tsconfig file for Jest
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
