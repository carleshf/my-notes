class Notes {
    constructor(dao) {
        this.dao = dao
    }

    createTable = () => {
        const sql = `
        CREATE TABLE IF NOT EXISTS notes (
            iid INTEGER PRIMARY KEY AUTOINCREMENT,
            id TEXT,
            author TEXT,
            date TEXT,
            title TEXT,
            content TEXT,
            public BOOLEAN)`
        return this.dao.run(sql)
    }

    create = (note) => {
        return this.dao.run(
            `INSERT INTO notes (id, author, date, title, content, public)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [note.id, note.author, note.date, note.title, note.content, note.public]
        )
    }

    getById = (id, author) => {
        return this.dao.get(
            `SELECT * FROM notes WHERE id = ? AND author = ?`,
                [id, author]
        )
    }

    getByAuthor = (author) => {
        console.log
        return this.dao.all(
            `SELECT * FROM notes WHERE author = ?`,
                [author]
        )
    }

    update = (note) => {
        return this.dao.run(
            `UPDATE notes
                SET date = ?, title = ?, content = ?, public = ?
                WHERE id = ?`,
                [note.date, note.title, note.content, note.public, note.id]
        )
    }
    
    delete(id) {
        return this.dao.run(
            `DELETE FROM notes WHERE id = ?`,
                [id]
        )
    }
}

module.exports = Notes