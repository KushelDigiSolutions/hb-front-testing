export interface Assessment {
    success: boolean;
    data: AssessmentData[];
    total: number;
}

export interface AssessmentData {
    image: AssessmentImage;
    totalResponses: number;
    isActive: boolean;
    time_limit: number;
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    description: string;
}

export interface AssessmentImage {
    type: string;
    originalName: string;
    savedName: string;
    alt: string;
    mimeType: string;
    url: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}