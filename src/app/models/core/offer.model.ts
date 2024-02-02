
import { CityINEGI } from "./city-inegi.model"
import { Company } from "./company.model"
import { Countries } from "./countries.model"
import { JobCategory } from "./job-category.model"
import { JobSubcategory } from "./job-subcategory.model"
import { LevelStudy } from "./level-study.model"
import { RangeAmount } from "./range-amount.model"
import { StateINEGI } from "./state-inegi.model"
import { TypeOfJob } from "./type-of-job.model"
import { TypeOfPayment } from "./type-of-payment.model"
import { User } from "./user.model"

export interface Offer {
    address: string
    benefits: string[]
    category: JobCategory
    city: CityINEGI
    comment: string
    company: Company
    consecutive: string
    country: Countries
    description: string
    haveComplaint: boolean
    id: number
    levelStudy: LevelStudy
    mainActivities: string[]
    maxPostulations: number
    rangeAmount: RangeAmount
    showCompany: boolean
    showSalary: boolean
    skills: string[]
    state: StateINEGI
    status: number
    subcategory: JobSubcategory
    title: string
    typeOfJob: TypeOfJob
    typeOfOffer: number
    typeOfPayment: TypeOfPayment
    urgency: string
    user: User
    workPlace: string
}