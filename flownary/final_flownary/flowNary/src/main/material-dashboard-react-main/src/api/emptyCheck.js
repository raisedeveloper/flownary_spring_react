export function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value).length === 0;
    }

    return false;
}