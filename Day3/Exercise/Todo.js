class Todo {
    constructor(description, date) {
        this.id = Date.now().toString();
        this.description = description;
        this.date = date;
        this.is_checked = false;
    }
}

module.exports = Todo;