export function parseFechaHora(fh) {
    if (!fh) return new Date(NaN);
    if (Array.isArray(fh)) {
        const [y, m = 1, d = 1, h = 0, mi = 0, s = 0] = fh;
        return new Date(y, m - 1, d, h, mi, s);
    }
    if (typeof fh === 'string') {
        const match = fh.match(/^(\d{4}),(\d{1,2}),(\d{1,2})T(\d{1,2}),(\d{1,2})$/);
        if (match) {
            let [, year, month, day, hour, minute] = match;
            month = month.padStart(2, '0');
            day = day.padStart(2, '0');
            hour = hour.padStart(2, '0');
            minute = minute.padStart(2, '0');
            return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
        }
    }
    return new Date(fh);
}

export function formatFechaHora(fh) {
    const date = parseFechaHora(fh);
    return isNaN(date.getTime())
        ? 'Fecha no válida'
        : date.toLocaleString('es-CR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
}