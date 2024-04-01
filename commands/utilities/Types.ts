import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type CommandType = {
	// contains data about the command, such as name and cmd description
	data: SlashCommandBuilder;

	/**
	 * Executes a Discord slash command
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>; 
};

// -------------------------
// Scraper types:
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
// --------------------------
// Postgres types

export type CourseList = { user_id: string, course: string, channel_id?: string, previously_open?: boolean; }[]

export type searchUserType = { id: number, message: string, alert_time: Date; }[]
export type searchTimeType = { id: number, message: string, user_id: string, channel_id: string; }[]
export type searchIDType = { message: string, alert_time: Date }[]
