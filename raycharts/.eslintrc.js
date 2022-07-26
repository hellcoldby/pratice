module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
       "no-unused-vars":0,
         "react/prop-types": 0 ,
         "no-useless-escape":0,
         "no-empty": 0,
         "@typescript-eslint/no-empty-function":0,
         "@typescript-eslint/no-this-alias":0,
         "no-undef":0,
       
    },
}
