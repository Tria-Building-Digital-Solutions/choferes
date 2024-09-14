import express from 'express';
import bodyParser from 'body-parser';
import { json, urlencoded } from 'body-parser';
import { Sequelize } from 'sequelize';
import employeeRoutes from './routes/employeeRoutes'; 
import hoursWorkedRoutes from './routes/hoursWorkedRoutes'; 
import weeklySummaryRoutes from './routes/weeklySummaryRoutes'; 
import biweeklySummaryRoutes from './routes/biweeklySummaryRoutes'; 
import monthlySummaryRoutes from './routes/monthlySummaryRoutes'; 

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/employees', employeeRoutes);
app.use('/api/hours', hoursWorkedRoutes);
app.use('/api/weekly-summary', weeklySummaryRoutes);
app.use('/api/biweekly-summary', biweeklySummaryRoutes);
app.use('/api/monthly-summary', monthlySummaryRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import sequelize from './config/database'; 
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
