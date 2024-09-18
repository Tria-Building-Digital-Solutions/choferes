import express from 'express';
import bodyParser from 'body-parser';
import employeeRoutes from './routes/employeeRoutes';
import hoursWorkedRoutes from './routes/hoursWorkedRoutes';
import weeklySummaryRoutes from './routes/weeklySummaryRoutes';
import biweeklySummaryRoutes from './routes/biweeklySummaryRoutes';
import monthlySummaryRoutes from './routes/monthlySummaryRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api', employeeRoutes);
app.use('/api', hoursWorkedRoutes);
app.use('/api', weeklySummaryRoutes);
app.use('/api', biweeklySummaryRoutes);
app.use('/api', monthlySummaryRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
