export default function Format(str){
    // Remove spaces
    str = str.replace(/\s/g, '');

    // Remove accents
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return str.toLowerCase();
}