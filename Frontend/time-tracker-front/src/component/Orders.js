import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {

    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        loadTasks();
    }, []);
    const loadTasks=async ()=> {
            const result = await fetch("http://localhost:9192/api/v1/tasks/my-tasks", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        navigate('/');
                        throw new Error('Please Login');
                    }
                })
                .then(data => setTasks(data))
                .catch(error => console.error(error));
    }

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.taskName}</TableCell>
              <TableCell>{row.spentTime}</TableCell>
              <TableCell>{row.startTime}</TableCell>
              <TableCell>{row.complete}</TableCell>
              <TableCell align="right">{`$${row.active}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
