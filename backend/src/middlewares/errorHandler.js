const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error(`[ERROR]`, {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Something went wrong"
                : err.message
    });
};


export default errorHandler