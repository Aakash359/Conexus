const phoneReplacementRegex = /[\-\s\(\)]/g;
const phoneValueRegex = /^[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/g;

export const phoneFormatter = {
    format10Digit(value: string = '') {

        var rawNumber = value.replace(phoneReplacementRegex, '');

        switch (value.length) {
            case 0:
            case 1:
            case 2:
            case 3:
                return rawNumber.substr(0);
            case 4:
            case 5:
            case 6:
                return rawNumber.substr(0, 3) + '-' + rawNumber.substr(3);
            default:
                return rawNumber.substr(0, 3) + '-' + rawNumber.substr(3, 3) + '-' + rawNumber.substr(6);
        }
    },
    stripFormatting(value: string) {
        return value.replace(phoneReplacementRegex, '');
    },
    isValid10DigitPhoneNumber(value: string) {
        return phoneValueRegex.test(phoneFormatter.stripFormatting(value))
    }
}