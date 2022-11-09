import { Response } from "express"

const respond = (res: Response, status: number = 200, message: string, data: any = null) => {
    const successCodes = [200, 201,]

    return res.status(status).send({
        status: successCodes.includes(status) ? 'success' : 'error',
        message,
        data,
    })

}

export default respond