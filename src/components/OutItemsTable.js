import React from "react";
import { v4 as uuidv4 } from "uuid";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";

export function OutItemsTable({boxes}) {
  return (
    <Table id="#outTable">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography style={{ fontWeight: 600 }}>Type</Typography>
          </TableCell>
          <TableCell>
            <Typography style={{ fontWeight: 600 }}>Size</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {boxes
          ? boxes.map((box) => {
              return (
                <TableRow key={uuidv4()}>
                  <TableCell>{box.title}</TableCell>
                  <TableCell>{`${box.w}x${box.h}`}</TableCell>
                </TableRow>
              );
            })
          : null}
      </TableBody>
    </Table>
  );
}
