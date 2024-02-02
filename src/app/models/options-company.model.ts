import { Company } from "./core/company.model"

export interface OpinionsCompany {
    company: Company
    culture: number
    id: number
    opinion: string
    oportunities: number
    rangeAmountQ: number
    title: string
}