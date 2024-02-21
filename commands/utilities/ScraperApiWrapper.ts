import axios, { AxiosInstance } from "axios";

export type ScraperResponse<T> = T | { error: string; } | null;

export interface WebRegSection {
    subj_course_id: string;
    section_id: string;
    section_code: string;
    all_instructors: string[];
    available_seats: number;
    enrolled_ct: number;
    total_seats: number;
    waitlist_ct: number;
    meetings: Meeting[];
    needs_waitlist: boolean;
    is_visible: boolean;
}

export interface IWebRegSearchResult {
    subj_code: string;
    course_code: string;
    course_title: string;
}


export interface Meeting {
    meeting_type: string;
    meeting_days: string[] | string | null;
    start_hr: number;
    start_min: number;
    end_hr: number;
    end_min: number;
    building: string;
    room: string;
}

export interface ISearchQuery {
    subjects: string[];
    courses: string[];
    departments: string[];
    instructor?: string;
    title?: string;
    only_allow_open: boolean;
    show_lower_div: boolean;
    show_upper_div: boolean;
    show_grad_div: boolean;
    start_min?: number;
    start_hr?: number;
    end_min?: number;
    end_hr?: number;
}

export class ScraperApiWrapper {
    private static _instance: ScraperApiWrapper | null = null;

    private _apiBase: string;
    private _apiKey?: string;
    private _axios: AxiosInstance;

    private constructor() {
        this._apiBase = "";
        this._apiKey = "";
        this._axios = axios.create();
    }

    /**
     * Gets or creates an instance of this wrapper.
     *
     * @returns {ScraperApiWrapper} The instance.
     */
    public static getInstance(): ScraperApiWrapper {
        if (ScraperApiWrapper._instance === null) {
            ScraperApiWrapper._instance = new ScraperApiWrapper();
        }

        return ScraperApiWrapper._instance;
    }

    /**
     * Initializes the information needed to make calls to the API.
     *
     * @param {string} apiBase The base URL for the API.
     * @param {string} apiKey The API key, if any.
     * @throws {Error} If this function is called before initialization.
     */
    public static init(apiBase: string, apiKey?: string): void {
        if (ScraperApiWrapper._instance === null) {
            throw new Error("this should be initialized before being used.");
        }
        else {
            ScraperApiWrapper._instance._apiBase = apiBase;
            ScraperApiWrapper._instance._apiKey = apiKey;
        }
    }

    /**
     * Gets basic course information from WebReg.
     * 
     * @param {string} term The term.
     * @param {string} subject The subject part of the course number (e.g., for `CSE 100`, use `CSE`)
     * @param {string} number The number part of the course number (e.g., for `CSE 100`, use `100`)
     * @returns {Promise<ScraperResponse<WebRegSection[]>>} Information about all sections for a course, 
     * if any. Some other options include an object with an error key or `null`.
     */
    public async getCourseInfo(
        term: string,
        subject: string,
        number: string
    ): Promise<ScraperResponse<WebRegSection[]>> {
        try {
            return await this._axios.get(
                `${this._apiBase}/live/${term}/course_info?subject=${subject}&number=${number}`,
                {
                    headers: {
                        Authorization: `Bearer ${this._apiKey}`
                    }
                }
            ).then(r => r.data);
        }
        catch (e) {
            return null;
        }
    }

    /**
     * Searches for one or more courses on WebReg based on a number of different factors.
     * 
     * @param {string} term The term.
     * @param {ISearchQuery} query The search query.
     * @returns {Promise<ScraperResponse<IWebRegSearchResult[]>>} All possible courses that meet the
     * query. Some other options include an object with an error key or `null`.
     */
    public async searchCourse(
        term: string,
        query: ISearchQuery
    ): Promise<ScraperResponse<IWebRegSearchResult[]>> {
        try {
            return await this._axios.get(
                `${this._apiBase}/live/${term}/search`,
                {
                    headers: {
                        Authorization: `Bearer ${this._apiKey}`
                    },
                    data: query
                }
            ).then(r => r.data);
        }
        catch (e) {
            return null;
        }           
    }
}