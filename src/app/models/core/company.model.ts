import { JobCategory } from "./job-category.model"

export interface Company{
    addres: string
    category: JobCategory
    description: string
    id: number
    imageURL: string
    isvisible: boolean
    name: string
    ownerId: number
    qualification: number
    recruiter: boolean
    regimenFiscal: string
    rfc: string
    sizeCompany: string
    urlLinkedin: string
    urlSite: string
}