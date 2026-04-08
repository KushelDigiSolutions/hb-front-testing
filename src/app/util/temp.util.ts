interface RootObject {
    type: string;
    _id: string;
    question: string;
    answer: Answer[];
    assessment_id: Assessmentid;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Assessmentid {
    image: string;
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

interface Answer {
    category: string;
    _id: string;
    title: string;
}