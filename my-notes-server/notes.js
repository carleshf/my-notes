class Notes {
    constructor(dao) {
        this.dao = dao
    }

    createTable = () => {
        const sql = `
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shortId			TEXT,
            nickname		TEXT,
			author			TEXT,
            creationDate	TEXT,
			updateDate 		TEXT,
            title 			TEXT,
            content 		TEXT,
            isPublic 		BOOLEAN,
			showCreation	BOOLEAN,
			showUpdate		BOOLEAN,
			showAuthor		BOOLEAN
		)`
        return this.dao.run(sql)
    }

    create = (note) => {
        return this.dao.run(
            `INSERT INTO notes 
				(shortId, nickname, author, creationDate, updateDate, title, content, isPublic, showCreation, showUpdate, showAuthor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [note.shortId, note.nickname, note.author, note.creationDate, note.updateDate, note.title, note.content, note.isPublic, note.showCreation, note.showUpdate, note.showAuthor]
        )
    }

    getByIdAndAuthor = (shortId, nickname) => {
        return this.dao.get(
            `SELECT * FROM notes WHERE shortId = ? AND nickname = ?`,
                [shortId, nickname]
        )
    }

    getByIdPublic = (shortId, checkPublic = false) => {
        if(checkPublic) {
            return this.dao.get(
                `SELECT * FROM notes WHERE shortId = ? AND isPublic = 1`,
                    [shortId]
            )
        } else {
            return this.dao.get(
                `SELECT * FROM notes WHERE isPublic = ?`,
                    [isPublic]
            )
        }
    }

    getByAuthor = (nickname) => {
        console.log
        return this.dao.all(
            `SELECT * FROM notes WHERE nickname = ?`,
                [nickname]
        )
    }

    update = (note) => {
        return this.dao.run(
            `UPDATE notes SET 
				updateDate = ?, title = ?, content = ?, isPublic = ?, showCreation = ?, showUpdate = ?, showAuthor = ?
            WHERE shortId = ?`,
				[note.updateDate, note.title, note.content, note.isPublic, note.showCreation, note.showUpdate, note.showAuthor, note.shortId]
        )
    }
    
    delete(shortId, nickname) {
        return this.dao.run(
            `DELETE FROM notes WHERE shortId = ? and nickname = ?`,
                [shortId, nickname]
        )
    }
}

module.exports = Notes