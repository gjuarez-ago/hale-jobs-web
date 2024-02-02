import { User } from "../core/user.model"
import { Offer } from "../core/offer.model"

export interface CommentsOffer{
    comment: string
    consecutive: string
    id: number
    offer: Offer
    user: User
}

