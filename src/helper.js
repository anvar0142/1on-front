export const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < employee.value.length; i++) {
        if (employee.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};