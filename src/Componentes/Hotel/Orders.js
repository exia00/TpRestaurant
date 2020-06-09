import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(0, '15 Oct, 2019', '20 Oct, 2019', 'Fernado Palomo', 'VISA ⠀•••• 3719', 3120.44),
  createData(1, '15 Oct, 2019', '20 Oct, 2019', 'Juan Fernandez', 'VISA ⠀•••• 2574', 8660.99),
  createData(2, '15 Oct, 2019', '20 Oct, 2019', 'Martin Velazquez', 'MC ⠀•••• 1253', 1000.81),
  createData(3, '15 Oct, 2019', '20 Oct, 2019', 'Sergio Perez', 'AMEX ⠀•••• 2000', 6540.39),
  createData(4, '14 Oct, 2019', '20 Oct, 2019', 'Carlos Abila', 'VISA ⠀•••• 5919', 2120.79),
];

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Ultimas Reservas</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Check-In</TableCell>
            <TableCell>Check-Out</TableCell>
            <TableCell>Reservado Por</TableCell>
            <TableCell>Metodo de Pago</TableCell>
            <TableCell align="right">Monto Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="">
          Ver Mas Reservas
        </Link>
      </div>
    </React.Fragment>
  );
}