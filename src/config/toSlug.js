export function toSlug(str) {
    return str
        .normalize('NFD') // chuẩn hóa Unicode
        .replace(/[\u0300-\u036f]/g, '') // xóa các dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}
