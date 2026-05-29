import axios from "axios";
import { PostBodyI } from "../types";
import FormData from 'form-data'
import fs from 'fs'


export const postMySite = async (body: PostBodyI, images: Express.Multer.File[]) => {
    try {
        const formData = new FormData()
        formData.append("title", body.title)
        formData.append("description", body.description)
        formData.append("price", String(body.price))
        formData.append("category_id", String(body.category_id))
        formData.append("quantity", String(body.quantity))
        formData.append("sale", "0")
        formData.append("search_aliace", body.searchAliace)
        formData.append("hidden", "no")
        const sizesJson = typeof body.sizes === 'string' ? body.sizes : JSON.stringify(body.sizes)
        formData.append("sizes", sizesJson)
        for (const image of images) {
            formData.append("images", fs.createReadStream(image.path), {
                filename: image.originalname,
                contentType: image.mimetype,
            })
        }
        const result = await axios.post(`${process.env.MYSITE_URL}/createproduct`,
            formData,
            { headers: { ...formData.getHeaders(), "x-secret": process.env.ACESS_SECRET_KEY } }
        )
        return console.log("На сайт загружено");

    } catch (error: any) {
        console.error(error);
        throw new Error("Iternal server error")
    }

}