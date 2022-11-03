import { con } from database_config.module.js;

module.exports = {
    insertRank: (id, clear_time, callback) => {
        const query_string = "insert into Rank(id, clearTime) values (?, ?)";

        const params = [id, clear_time];

        db.query(query_string, params, (err, result) => {
            callback(err, result);
        })
    },
    getRank: (callback) => {
        const query_string = "select * from Rank order by clearTime DESC limit 10";

        db.query(query_string, (err, result) => {
            callback(err, result);
        })
    }
}