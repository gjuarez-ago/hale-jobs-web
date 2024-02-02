import { Offer } from "./core/offer.model"
import { User } from "./core/user.model"

export interface PostulatesOffer {
    consecutive: string
    id: number
    offer: Offer
    regBorrado: number
    regDateCreated: string
    status: number
    user: User
}