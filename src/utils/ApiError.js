class ApiError extends Error {
    construncter( statusCode, massage = "Someting is went wrong", error = [], stack = "") {
        super(massage);
        this.statusCode = statusCode;
        this.error = error; 
        this.stack = stack;
    }
}

export default ApiError;