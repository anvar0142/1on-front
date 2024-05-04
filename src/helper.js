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

export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export const formatDate = (initDate) => {
    const date = new Date(initDate)
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return year + "-" + month + "-" + day;
}