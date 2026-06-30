export const allExceptionHandler = (err, req, res, next) => {
    let status = err?.status ?? err?.statusCode ?? err?.code;
    if (!status || isNaN(+status) || status > 511 || status < 200) status = 500;
    res.status(status).json({
        success: false,
        message: err?.message ?? err?.stack ?? "Internal Server Error",
    });
};
