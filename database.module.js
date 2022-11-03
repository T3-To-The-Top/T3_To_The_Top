import { con } from database_config.module.js;

module.exports = {
    //ranking insert query
    insertRank: (id, clear_time, callback) => {
        const query_string = "insert into Rank(id, clearTime) values (?, ?)";

        const params = [id, clear_time];

        con.query(query_string, params, (err, result) => {
            callback(err, result);
        })
    },
    //ranking top 10 select query
    getRank: (callback) => {
        const query_string = "select * from Rank order by clearTime DESC limit 10";

        con.query(query_string, (err, result) => {
            callback(err, result);
        })
    }
}