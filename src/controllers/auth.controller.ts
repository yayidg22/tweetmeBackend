import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { generateUserAlternalName } from '../utilities/StringUtil';

const jwtSecret = process.env.SECRET_KEY as string;

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                name: true,
            }
        });
        res.status(200).json({
            ok: true,
            data: {
                users
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        bcrypt.hash(password, 10, async (err, hash) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hash,
                    name,
                    alternalName: generateUserAlternalName(name),
                    selectedCharacter:1
                },
                select: {
                    id: true,
                    name: true,
                    alternalName:true,
                    selectedCharacter:true,
                    email: true,
                }
            })
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: user.id },
                jwtSecret ,
                {
                    // 3hrs in sec
                    expiresIn: maxAge,
                }
            );
            res.status(200).json({
                ok: true,
                data: {
                    token,
                    name: user.name,
                    alternalName: user.alternalName,
                    selectedCharacter:user.selectedCharacter,
                    email: user.email,
                }
            });
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email or Password not present",
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(400).json({
                message: "User doesn't exist",
            })
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    // 3hrs in sec
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user.id },
                        jwtSecret,
                        {
                            expiresIn: maxAge,
                        }
                    );
                    res.status(200).json({
                        ok: true,
                        data: {
                            token,
                            name: user.name,
                            email: user.email,
                            alternalName: user.alternalName,
                            selectedCharacter:user.selectedCharacter,
                        }
                    });
                } else {
                    res.status(400).json({
                        message: "User doesn't exist",
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const getUserData = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: res.locals.userId,
            },
            select: {
                alternalName: true,
                selectedCharacter:true,
                email: true,
                name: true,
            }
        });
        res.status(200).json({
            ok: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateSelectedCharacter = async (req: Request, res: Response) => {
    try {
        const { selectedCharacter } = req.body;
        const user = await prisma.user.update({
            where:{
                id:res.locals.userId,
            },
            data: {
                selectedCharacter
            },
            select: {
                id: true,
                name: true,
                alternalName:true,
                selectedCharacter:true,
                email: true,
            }
        })
            res.status(200).json({
                ok: true,
                data: {
                    name: user.name,
                    alternalName: user.alternalName,
                    selectedCharacter:user.selectedCharacter,
                    email: user.email,
                }
            });

    } catch (error) {
        res.status(500).json(error);
    }
}

export default {
    register,
    login,
    getAllUsers,
    getUserData,
    updateSelectedCharacter
}