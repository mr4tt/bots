import {
    ActionRowBuilder,
    ButtonBuilder,
    ColorResolvable,
    ComponentType,
    EmbedBuilder,
    Guild,
    GuildMember,
    SelectMenuBuilder,
    StringSelectMenuBuilder,
    User
} from "discord.js";

/**
 * Logs the time, method, chosen output, and level. 
 * @param {string | object} input The input to print. 
 * @param {string} method The method used.
 * @param {string} level The log level
 * @returns <void>
 */
type logLevel = "INFO" | "WARN" | "ERROR" 
export function log(input: unknown, method: string, level: logLevel): void {
    console.log("-------------------------------");
    console.log((new Date()).toDateString() + ", at " + (new Date()).toTimeString());
    console.log("Function: " + method + "\n");
    console.log("Output -- " + level);
    console.log(input);
    console.log("-------------------------------\n");
}

/**
 * Stops execution of a function for a specified period of time.
 * @param {number} time The time, in milliseconds, to delay execution.
 * @returns {Promise<void>}
 */
export async function stopFor(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve();
        }, time);
    });
}

/**
 * Creates a blank embed with the author and color set.
 * @param {User | GuildMember | Guild} obj The user, guild member, or guild to show in the author section of the
 * embed.
 * @param {ColorResolvable} color The color of this embed.
 * @returns {EmbedBuilder} The new embed.
 */
export function generateBlankEmbed(
    obj: User | GuildMember | Guild,
    color: ColorResolvable = "Random"
): EmbedBuilder {
    const embed = new EmbedBuilder().setTimestamp().setColor(color);
    if (obj instanceof User) {
        embed.setAuthor({ name: obj.tag, iconURL: obj.displayAvatarURL() });
    }
    else if (obj instanceof GuildMember) {
        embed.setAuthor({ name: obj.displayName, iconURL: obj.user.displayAvatarURL() });
    }
    else {
        const icon = obj.iconURL();
        if (icon) {
            embed.setAuthor({ name: obj.name, iconURL: icon });
        }
        else {
            embed.setAuthor({ name: obj.name });
        }
    }

    return embed;
}

/**
 * Parses the course subject code from a given string.
 * @param {string} code The raw course subject code.
 * @returns {string} The parsed course subject code.
 */
export function parseCourseSubjCode(code: string): string {
    let s = "";
    let i = 0;
    for (; i < code.length; i++) {
        // Regex to see if it's a number
        const numRegex = new RegExp('/^\d+$/');
        
        if (/^\d+$/.test(code[i])) {
            break;
        }

        if (code[i] === " ") {
            continue;
        }

        s += code[i];
    }

    s += " ";

    for (; i < code.length; i++) {
        s += code[i];
    }

    return s.toUpperCase().trim();
}

/**
 * Gets an array of `ActionRowBuilder` from an array of components.
 * @param {(ButtonBuilder | SelectMenuBuilder)[]} options The components.
 * @return {ActionRowBuilder[]} The array of `ActionRowBuilder`.
 */
export function getActionRowsFromComponents(
    options: (ButtonBuilder | SelectMenuBuilder)[]
): ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] {
    // Discord's restriction on number of options 
    const MAX_ACTION_ROWS: number = 5;
    const rows: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[] = [];
    let rowsUsed = 0;

    const selectMenus = options.filter((x) => x.data.type === ComponentType.StringSelect) as StringSelectMenuBuilder[];
    for (let i = 0; i < Math.min(selectMenus.length, MAX_ACTION_ROWS); i++) {
        rows.push(new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenus[i]));
        rowsUsed++;
    }

    const buttons = options.filter((x) => x.data.type === ComponentType.Button) as ButtonBuilder[];
    for (let i = 0; i < Math.min(buttons.length, 5 * (MAX_ACTION_ROWS - rowsUsed)); i += 5) {
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        for (let j = 0; j < 5 && i + j < buttons.length; j++) {
            actionRow.addComponents(buttons[i + j]);
        }

        rows.push(actionRow);
    }

    return rows;
}