import { Offer } from "./core/offer.model"

export interface Notification {
    consecutive: string
    content: string
    emailDestination: [string]
    id: number
    offer: Offer
    relatedRequest: string
    sendBy: string
    title: string
    typeAD: string
}