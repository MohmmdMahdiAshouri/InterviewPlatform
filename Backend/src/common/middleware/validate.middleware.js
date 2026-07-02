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
            req[source] = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
}
