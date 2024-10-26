export const { 
    query, 
    matchedData, 
    validationResult,
    checkSchema,
    body 
} = require("express-validator")


export const cartProductValidatorSchema = {
    name: {
        isString: {
            errorMessage: "Product name must be string"
        },
        notEmpty: {
            errorMessage: "Product name cannot be empty"
        }
    },
    price: {
        isDecimal: {
            errorMessage: "Product price must be decimal"
        },
        notEmpty: {
            errorMessage: "Product price cannot be empty"
        }
    },
    quantity: {
        isInt: {
            errorMessage: "Product quantity must be integer"
        },
        notEmpty: {
            errorMessage: "Product quantity cannot be empty"
        }
    }
}


export const loginValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Username cannot be empty"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty"
        }
    }
}


export const userValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username has to be within 5 and 32 chars"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be string"
        }
    },
    displayName: {
        isString: {
            errorMessage: "Username must be string"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        }
    },
    password: {
        isString: {
            errorMessage: "Password must be string" 
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        }
    }
}