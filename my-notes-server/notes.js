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
            nickname TEXT,
            date TEXT,
            title TEXT,
            content TEXT,
            public BOOLEAN)`
        return this.dao.run(sql)
    }

    create = (note) => {
        return this.dao.run(
            `INSERT INTO notes (id, author, nickname, date, title, content, public)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [note.id, note.author, note.nickname, note.date, note.title, note.content, note.public]
        )
    }

    getByIdAndAuthor = (id, nickname) => {
        return this.dao.get(
            `SELECT * FROM notes WHERE id = ? AND nickname = ?`,
                [id, nickname]
        )
    }

    getByIdPublic = (id, checkPublic = false) => {
        if(checkPublic) {
            return this.dao.get(
                `SELECT * FROM notes WHERE id = ? AND public = 1`,
                    [id]
            )
        } else {
            return this.dao.get(
                `SELECT * FROM notes WHERE id = ?`,
                    [id]
            )
        }
    }

    getByAuthor = (author) => {
        console.log
        return this.dao.all(
            `SELECT * FROM notes WHERE nickname = ?`,
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