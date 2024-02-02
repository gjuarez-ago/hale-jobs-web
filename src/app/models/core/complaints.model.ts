import { Offer } from "./offer.model"
import { User } from "./user.model"

export interface Complaints {
    comments: string
    id: number
    offer: Offer
    status: string
    title: string
    type: number
    user: User
}