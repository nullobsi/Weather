interface DiscordRole {
    id: string,
    name: string,
    color: number,
    hoist: boolean,
    position: number,
    permissions: string,
    managed: boolean,
    mentionable: boolean,
}

export default DiscordRole;