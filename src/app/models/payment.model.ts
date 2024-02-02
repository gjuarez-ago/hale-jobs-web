import { User } from "./core/user.model"

export interface Payment {
    amount: number
    consecutive: string
    currency: string
    estatus: number
    id: number
    methodPayment: string
    pack: number
    referenceId: string
    regBorrado: number
    statusReference: string
    user: User
}