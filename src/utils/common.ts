export const classList = (classes: any) => {
    return Object.entries(classes)
        .filter(entry => entry[1])
        .map(entry => entry[0])
        .join(" ");
}

export const sorting = (data: any, key: any,  orderBy: any) => {
    data.sort(function (a: any, b: any) {
        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (orderBy === true) ? (comparison * -1) : comparison
        );
    })
}

export const commafy = (num: any) => {
    var str = num.toString().split(".");
    if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, "$1 ");
    }
    return str.join(".");
}

export const buildFilter = (data: any) => {
    var qParams: any = {};
    for (var property in data) {
        var formattedData = formatData(data[property]);
        for (var subProp in formattedData) {
            qParams[property + subProp] = formattedData[subProp];
        }
    }
    return qParams;
}

export const formatData = (data: any) => {
    if (typeof data === 'object') {
        var result: any = {};
        var newProperty: any = {};
        for (var property in data) {
            var formattedData = formatData(data[property]);
            if (typeof formattedData === 'object') {
                for (var subProperty in formattedData) {
                    newProperty = '[' + property + ']' + subProperty;
                    result[newProperty] = formattedData[subProperty];
                }
            } else {
                newProperty = '[' + property + ']';
                result[newProperty] = formattedData;
            }
        }
        return result;
    } else {
        return data;
    }
}