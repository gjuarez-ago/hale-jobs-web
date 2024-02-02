import { Offer } from "./core/offer.model"
import { User } from "./core/user.model"

export interface EventsUser {
    dateBegin: string
    description: string
    id: number
    offer: Offer
    regDateCreated: string
    regDateUpdated: string
    status: number
    title: string
    urlMeet: string
    userGuest: User
    userRecruiter: User
}