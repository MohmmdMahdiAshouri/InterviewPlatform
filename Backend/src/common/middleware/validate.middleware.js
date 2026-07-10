import createHttpError from "http-errors";

export function validate(schema, source = "body") {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req[source]);
            if (!result.success) {
                const message =
                    result.error.issues[0]?.message ?? "Validation failed";
                throw createHttpError(400, message);
            }
            if (source === "query") {
                Object.keys(req.query).forEach((key) => {
                    delete req.query[key];
                });
                Object.assign(req.query, result.data);
            } else {
                req[source] = result.data;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}
