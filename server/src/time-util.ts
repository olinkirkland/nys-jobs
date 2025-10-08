/**
 * Returns a human-readable time string like "3 hours and 15 minutes", or "a week and 2 days"
 * for a given time delta in seconds.
 */
export function getHumanReadableTime(delta: number): string {
    const weeks = Math.floor(delta / 604800);
    delta -= weeks * 604800;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);

    if (weeks > 0) {
        return (
            weeks +
            (weeks === 1 ? ' week' : ' weeks') +
            (days > 0 ? ' and ' + days + (days === 1 ? ' day' : ' days') : '')
        );
    } else if (days > 0) {
        return (
            days +
            (days === 1 ? ' day' : ' days') +
            (hours > 0
                ? ' and ' + hours + (hours === 1 ? ' hour' : ' hours')
                : '')
        );
    } else if (hours > 0) {
        return (
            hours +
            (hours === 1 ? ' hour' : ' hours') +
            (minutes > 0
                ? ' and ' + minutes + (minutes === 1 ? ' minute' : ' minutes')
                : '')
        );
    } else if (minutes > 0) {
        return (
            minutes +
            (minutes === 1 ? ' minute' : ' minutes') +
            (seconds > 0
                ? ' and ' + seconds + (seconds === 1 ? ' second' : ' seconds')
                : '')
        );
    }
    return seconds + (seconds === 1 ? ' second' : ' seconds');
}
