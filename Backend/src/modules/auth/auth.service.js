import { prisma } from "../../configs/prisma.js";

async function sendOtpHandler(req, res, next) {
    try {
        const { phone, fullName } = req.body;

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        let user = await prisma.user.findUnique({
            where: {
                phone
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    fullName
                }
            });
        }

        await prisma.otp.upsert({
            where: {
                phone
            },

            update: {
                code,
                expiresAt: new Date(
                    Date.now() + 1000 * 60 * 2
                ),
                used: false,
                attempts: 0
            },

            create: {
                phone,
                code,
                expiresAt: new Date(
                    Date.now() + 1000 * 60 * 2
                )
            }
        });
        return res.status(200).json({
            message: "otp sent successfully",
            code
        });

    } catch (error) {
        next(error);
    }
}

export default sendOtpHandler;