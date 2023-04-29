import { Request, Response } from 'express';
import { prisma } from "../index";

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.posts.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        alternalName: true,
                        selectedCharacter:true
                    }
                }
            },
        });
        res.status(200).json({
            ok: true,
            data: {
                posts
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getPostByUser = async (req: Request, res: Response) => {
    try {
        const { alternalName } = req.query;
        const posts = await prisma.posts.findMany({
            where: {
                user: {
                    alternalName: String(alternalName)
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        alternalName: true,
                        selectedCharacter:true
                    }
                }
            },
        });
        console.log(posts);
        res.status(200).json({
            ok: true,
            data: {
                posts
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const addNewPost = async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        const post = await prisma.posts.create({
            data: {
                description,
                created_date: new Date(),
                userId: res.locals.userId,
            }
        });
        res.status(200).json({
            ok: true,
            data: {
                post
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

export default {
    getAllPosts,
    addNewPost,
    getPostByUser
}