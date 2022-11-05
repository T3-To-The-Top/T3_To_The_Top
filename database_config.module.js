import { createConnection } from 'mysql';

// Database configure
const config = {
    development: {
        host: 'database-1.civ5tm3dqze5.ap-northeast-2.rds.amazonaws.com',
        user: 'rookie',
        password: '11111111',
        database: 'T3'
    }
}

// Database connection
const con = createConnection( config[process.env.NODE_ENV || 'development'] )

// Exception handler
con.connect((err) => {
    if(err) throw err;
    console.log('Connected successfully');
})

export default con;