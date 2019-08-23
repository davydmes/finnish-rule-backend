let app = require('./index');

const index = require('./routes/index');
const roles = require('./routes/roles');
const signup = require('./routes/signup');
const login = require('./routes/login');
const profile = require('./routes/profile');
const checkin = require('./routes/checkin');
const clients = require('./routes/clients');
const bills = require('./routes/bill');
const queue = require('./routes/queue');
const groups = require('./routes/groups');
const products = require('./routes/products');
const jobs = require('./routes/jobs')


app.use('/', index);
app.use('/roles', roles);
app.use('/signup', signup);
app.use('/login', login);
app.use('/profile', profile);
app.use('/checkin',checkin);
app.use('/clients',clients);
app.use('/queue', queue);
app.use('/bills', bills);
app.use('/groups', groups);
app.use('/products', products);
app.use('/jobs', jobs);
app.use('*', index);