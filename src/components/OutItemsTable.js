import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";

export function OutItemsTable({ items }) {
  return (
    <Table  id="#outTable">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography style={{ fontWeight: 600 }}>Type</Typography>
          </TableCell>
          <TableCell>
            <Typography style={{ fontWeight: 600 }}>Size</Typography>
          </TableCell>
          <TableCell>
            <Typography style={{ fontWeight: 600 }}>Count</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items?items.map((item) => {
          return (
            <TableRow>
              <TableCell>{item.title}</TableCell>
              <TableCell>{`${item.width}x${item.height}`}</TableCell>
              <TableCell>{item.count}</TableCell>
            </TableRow>
          );
        }):null}
      </TableBody>
    </Table>
  );
}
